// Layout check over every route, so no page quietly goes back to a narrow strip on wide screens.
// Ported from Nenarivu. Serves dist/, drives headless Chrome over the DevTools protocol (no extra
// packages) and:
//   - at 1920px wide, fails a page whose visible content spans under 75% of the usable width, or whose
//     rows are on average less than 55% filled (a narrow column with a few wide lines under it);
//   - at 360px wide, fails a page that scrolls sideways.
// Usage: npm run build, then npm run check:layout. CHROME_PATH overrides where Chrome is found.
// Build without GITHUB_REPOSITORY set, so assets load from the server root.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";

const dist = join(import.meta.dirname, "..", "dist");
const MIN_FILL = 0.75;
// Average share of each row's usable width that holds content: catches a narrow column with wide lines under it.
const MIN_ROW_FILL = Number(process.env.MIN_ROW_FILL ?? 0.55);
const WIDE = 1920;
const NARROW = 360;
// Pages that are meant to be short notes rather than full layouts.
const SKIP = new Set(["*", "/home"]);

// Every route App.tsx declares, with a basic and a grammar lesson standing in for :lessonId.
const app = readFileSync(join(import.meta.dirname, "..", "src", "App.tsx"), "utf8");
const pages = [...app.matchAll(/path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((path) => !SKIP.has(path))
  .flatMap((path) =>
    path === "/lesson/:lessonId"
      ? ["/lesson/english-to-sinhala-lesson-1", "/lesson/si-exp-clauses"]
      : [path]
  );
pages.push("/practice?mode=mixed");

const types: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json"
};
const server = createServer((req, res) => {
  let path = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (path.endsWith("/")) path += "index.html";
  const file = join(dist, path);
  if (!file.startsWith(dist) || !existsSync(file)) return res.writeHead(404).end();
  res
    .writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" })
    .end(readFileSync(file));
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;

const chromePath =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=0",
    `--user-data-dir=${mkdtempSync(join(tmpdir(), "layout-"))}`,
    "about:blank"
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);
const wsUrl = await new Promise<string>((resolve, reject) => {
  let err = "";
  chrome.stderr.on("data", (d) => {
    err += d;
    const m = err.match(/DevTools listening on (ws:\S+)/);
    if (m) resolve(m[1]);
  });
  chrome.on("exit", () => reject(new Error(`Chrome exited: ${err}`)));
});

// Minimal DevTools protocol client over the browser's WebSocket, with one flattened page session.
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let nextId = 0;
const pending = new Map<number, (v: any) => void>();
const listeners: ((m: any) => void)[] = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(String(e.data));
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)!(m);
    pending.delete(m.id);
  } else listeners.forEach((l) => l(m));
});
const send = (method: string, params: object = {}, sessionId?: string) =>
  new Promise<any>((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, (m) =>
      m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)
    );
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (method: string, params: object = {}) => send(method, params, sessionId);
await page("Page.enable");

async function load(url: string, width: number) {
  await page("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: width < 768
  });
  const loaded = new Promise<void>((r) => {
    const l = (m: any) => {
      if (m.method === "Page.loadEventFired" && m.sessionId === sessionId) {
        listeners.splice(listeners.indexOf(l), 1);
        r();
      }
    };
    listeners.push(l);
  });
  // A hash change alone fires no load event, so every route is a fresh document.
  await page("Page.navigate", { url: `${origin}/?layout=${Math.random()}#${url}` });
  await loaded;
  // Let the route transition and the IndexedDB profile load settle.
  await new Promise((r) => setTimeout(r, 900));
}

// How far the visible content of <main> reaches, counting only things a reader sees: text, controls,
// media, and boxes with a background or border. Wrappers that are merely wide do not count.
const MEASURE = `(() => {
  const main = document.querySelector('main') ?? document.body;
  const vw = document.documentElement.clientWidth;
  // The header bar spans the site's full layout width, so it is the yardstick for "filled".
  const bar = document.querySelector('.globalnav .topRow') ?? main;
  const bs = getComputedStyle(bar);
  const usable = bar.getBoundingClientRect().width - parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight);
  let left = Infinity, right = -Infinity;
  for (const el of main.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const media = /^(IMG|SVG|INPUT|TEXTAREA|SELECT|BUTTON|CANVAS|VIDEO)$/i.test(el.tagName);
    const box = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0;
    if (!text && !media && !box) continue;
    left = Math.min(left, r.left);
    right = Math.max(right, r.right);
  }
  // What a reader sees: scroll through the page a screen at a time and, for each row of the screen,
  // measure how much of the usable width holds something. Sticky side rails count wherever they stay.
  // A narrow column with a few wide lines under it reaches the edges but leaves most rows half empty.
  const bar0 = bar.getBoundingClientRect().left + parseFloat(bs.paddingLeft);
  const vh = innerHeight;
  const content = [...main.querySelectorAll('*')].filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden]')) return false;
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const media = /^(IMG|SVG|INPUT|TEXTAREA|SELECT|BUTTON|CANVAS|VIDEO)$/i.test(el.tagName);
    const box = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0;
    return text || media || box;
  });
  const mainTop = main.getBoundingClientRect().top + scrollY, mainBottom = mainTop + main.scrollHeight;
  let sum = 0, rows = 0;
  for (let at = Math.max(0, mainTop - 80); at < mainBottom - vh * 0.3; at += Math.round(vh * 0.8)) {
    scrollTo(0, at);
    const rects = content.map((el) => el.getBoundingClientRect()).filter((r) => r.width >= 1 && r.height >= 1 && r.bottom > 0 && r.top < vh);
    for (let y = 80; y < vh; y += 24) {
      const spans = rects.filter((r) => r.top <= y && r.bottom > y).map((r) => [Math.max(r.left, bar0), Math.min(r.right, bar0 + usable)]).filter((s) => s[1] > s[0]).sort((a, b) => a[0] - b[0]);
      if (!spans.length) continue;
      let covered = 0, end = -Infinity;
      for (const [a, b] of spans) {
        if (b <= end) continue;
        covered += b - Math.max(a, end);
        end = b;
      }
      sum += covered / usable;
      rows++;
    }
  }
  scrollTo(0, 0);
  return { fill: (right - left) / usable, rowFill: rows ? sum / rows : 0, overflow: document.documentElement.scrollWidth > vw };
})()`;

const narrow: string[] = [];
const wide: { url: string; fill: number; rowFill: number }[] = [];
for (const url of pages.filter((p) => !SKIP.has(p))) {
  await load(url, WIDE);
  const w = (await page("Runtime.evaluate", { expression: MEASURE, returnByValue: true })).result
    .value;
  if (w.fill < MIN_FILL || w.rowFill < MIN_ROW_FILL)
    wide.push({ url, fill: w.fill, rowFill: w.rowFill });
  await load(url, NARROW);
  const n = (await page("Runtime.evaluate", { expression: MEASURE, returnByValue: true })).result
    .value;
  if (n.overflow) narrow.push(url);
}

ws.close();
chrome.kill();
server.close();

console.log(`${pages.length} pages checked at ${WIDE}px and ${NARROW}px.`);
for (const { url, fill, rowFill } of wide)
  console.log(
    `  narrow on wide screens (reaches ${Math.round(fill * 100)}%, rows ${Math.round(rowFill * 100)}% filled): ${url}`
  );
for (const url of narrow) console.log(`  scrolls sideways at ${NARROW}px: ${url}`);
if (wide.length || narrow.length) {
  console.log(`${wide.length + narrow.length} layout problems.`);
  process.exit(1);
}
console.log("Every page fills wide screens and fits a phone.");
