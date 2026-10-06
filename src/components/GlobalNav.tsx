import { Languages, Settings } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { courseProgress } from "../lib/course";

/*
 * The global navigation, built the way apple.com does it: one thin
 * translucent bar with every section spread across it, a panel that drops out
 * of the bar when a section is hovered, and on phones a menu that unrolls
 * beneath the bar. A status strip sits under it like a product's local nav.
 *
 * Every string here already ships elsewhere in the app in both languages;
 * none is new Sinhala, per AGENTS.md's rule against unreviewed learner text.
 */

type Lang = "en" | "si";
type Copy = Record<Lang, string>;
type SectionId = "today" | "learn" | "practice" | "words" | "progress";

const SECTIONS: { id: SectionId; to: string; label: Copy; routes: string[] }[] = [
  {
    id: "today",
    to: "/dashboard",
    label: { en: "Today", si: "අද" },
    routes: ["/dashboard", "/review"]
  },
  {
    id: "learn",
    to: "/learn",
    label: { en: "Learning path", si: "ඉගෙනුම් මාර්ගය" },
    routes: ["/learn", "/pronunciation", "/lesson"]
  },
  {
    id: "practice",
    to: "/practice",
    label: { en: "Practice", si: "පුහුණුව" },
    routes: [
      "/practice",
      "/alphabet",
      "/writing",
      "/listening",
      "/speaking",
      "/grammar",
      "/conversations"
    ]
  },
  {
    id: "words",
    to: "/vocabulary",
    label: { en: "Wordbook", si: "වචන පොත" },
    routes: ["/vocabulary"]
  },
  {
    id: "progress",
    to: "/progress",
    label: { en: "Progress", si: "ප්‍රගතිය" },
    routes: ["/progress", "/achievements"]
  }
];

const STUDIOS: [string, Copy][] = [
  ["/alphabet", { en: "Alphabet", si: "අක්ෂර" }],
  ["/writing", { en: "Writing", si: "ලිවීම" }],
  ["/listening", { en: "Listening", si: "සවන්දීම" }],
  ["/speaking", { en: "Speaking", si: "කතා කිරීම" }],
  ["/grammar", { en: "Grammar", si: "ව්‍යාකරණ" }],
  ["/conversations", { en: "Conversations", si: "සංවාද" }]
];

const MORE: [string, Copy][] = [
  ["/achievements", { en: "Milestones", si: "ජයග්‍රහණ" }],
  ["/settings", { en: "Settings", si: "සැකසුම්" }],
  ["/install", { en: "Install app", si: "යෙදුම ස්ථාපනය" }],
  ["/about", { en: "About", si: "අප ගැන" }],
  ["/privacy", { en: "Privacy", si: "පෞද්ගලිකත්වය" }]
];

const QUICK: [string, Copy][] = [
  ["/review", { en: "5-minute review", si: "මිනිත්තු 5 පුනරීක්ෂණය" }],
  ["/listening", { en: "Sound practice", si: "හඬ පුහුණුව" }],
  ["/writing", { en: "Trace a letter", si: "අකුරක් ලියන්න" }],
  ["/conversations", { en: "Role-play", si: "සංවාද පුහුණුව" }]
];

const TEXT = {
  skip: { en: "Skip to main content", si: "ප්‍රධාන අන්තර්ගතයට යන්න" },
  main: { en: "Main navigation", si: "ප්‍රධාන මෙනුව" },
  mobile: { en: "Mobile navigation", si: "ජංගම මෙනුව" },
  home: { en: "LingoLanka home", si: "LingoLanka මුල් පිටුව" },
  openMenu: { en: "Expand navigation", si: "මෙනුව විවෘත කරන්න" },
  closeMenu: { en: "Collapse navigation", si: "මෙනුව හකුළන්න" },
  studios: { en: "Skill studios", si: "කුසලතා පුහුණුව" },
  more: { en: "More", si: "තවත්" },
  quick: { en: "Quick practice", si: "ඉක්මන් පුහුණුව" },
  plan: { en: "Today’s plan", si: "අද සැලැස්ම" },
  next: { en: "Next lesson", si: "ඊළඟ පාඩම" },
  progress: { en: "Course progress", si: "පාඨමාලා ප්‍රගතිය" },
  words: { en: "Words learned", si: "ඉගෙනගත් වචන" },
  continue: { en: "Continue lesson", si: "පාඩම දිගටම කරන්න" },
  start: { en: "Start first lesson", si: "පළමු පාඩම අරඹන්න" },
  pronounce: { en: "Start here · Before Lesson 1", si: "මෙතැනින් අරඹන්න · පළමු පාඩමට පෙර" }
} satisfies Record<string, Copy>;

const minutes = (lang: Lang, n: number) => (lang === "si" ? `${n} මිනිත්තු` : `${n} min`);

type FlyLink = { label: string; note?: string; to: string; lang?: Lang };
type FlyMenu = {
  title: string;
  primary: FlyLink[];
  columns: { title: string; links: FlyLink[] }[];
};

/* ---------- the dropdown panel ---------- */

function NavFlyout({
  menu,
  open,
  onDone
}: {
  menu: FlyMenu | null;
  open: boolean;
  onDone: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // The panel's height follows its content, so moving between sections morphs
  // one height into the next instead of closing and reopening.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;
    const measure = () => panel.style.setProperty("--fly-h", `${inner.offsetHeight}px`);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [menu]);

  let i = 0;
  const item = (link: FlyLink) => (
    <li key={link.to + link.label} style={{ "--i": i++ } as CSSProperties}>
      <Link to={link.to} onClick={onDone}>
        {link.label}
        {link.note && <small>{link.note}</small>}
      </Link>
    </li>
  );

  return (
    <div
      id="nav-flyout"
      ref={panelRef}
      className={open ? "flyout open" : "flyout"}
      inert={!open}
      aria-hidden={!open}
    >
      {menu && (
        <div className="flyInner" ref={innerRef} key={menu.title}>
          <div className="flyCol flyPrimary">
            <h2 className="flyTitle">{menu.title}</h2>
            <ul>{menu.primary.map(item)}</ul>
          </div>
          {menu.columns.map((column) => (
            <div className="flyCol" key={column.title}>
              <h3 className="flyTitle">{column.title}</h3>
              <ul>{column.links.map(item)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- the bar ---------- */

export function GlobalNav() {
  const { profile, progress, vocabularyStates } = useApp();
  const location = useLocation();
  const lang: Lang = profile.settings.interfaceLanguage;
  const t = (copy: Copy) => copy[lang];
  const learningSinhala = profile.settings.direction === "english-to-sinhala";

  const [fly, setFly] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const flyTimer = useRef<number | undefined>(undefined);
  // The section whose links the panel shows. It outlives `fly` so the panel
  // keeps its content while it animates closed.
  const [shown, setShown] = useState<SectionId>("today");
  const openFly = (id: SectionId) => {
    setFly(id);
    setShown(id);
  };
  const [seenPath, setSeenPath] = useState(location.pathname);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const course = courseProgress(profile.settings.direction, progress);
  const lessonTitle = (lesson: { title: string; titleSi: string }) =>
    lang === "si" ? lesson.titleSi : lesson.title;
  const wordsLearned = vocabularyStates.filter((item) => item.learned).length;

  const section = SECTIONS.find((item) =>
    item.routes.some(
      (route) => location.pathname === route || location.pathname.startsWith(`${route}/`)
    )
  )?.id;

  // Any navigation closes whatever was open - including back and forward,
  // which never pass through a click handler.
  if (seenPath !== location.pathname) {
    setSeenPath(location.pathname);
    setFly(null);
    setMenuOpen(false);
  }

  // The phone menu covers the page, so the page must not scroll beneath it.
  useEffect(() => {
    document.body.classList.toggle("menu-locked", menuOpen);
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-locked");
    };
  }, [menuOpen]);

  // The phone menu and the flyout both hang from the bottom of the header,
  // whose height changes with the status strip and the text size setting.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () =>
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(flyTimer.current), []);

  /* Opening waits a beat so a pointer crossing the bar doesn't flash panels;
     once one is open, moving along the bar switches instantly, as on apple.com. */
  const hoverFly = (id: SectionId | null, event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(flyTimer.current);
    if (id === null) flyTimer.current = window.setTimeout(() => setFly(null), 180);
    else if (fly) openFly(id);
    else flyTimer.current = window.setTimeout(() => openFly(id), 140);
  };

  const quick = QUICK.map(([to, label]) => ({ to, label: t(label) }));
  const flyouts: Record<SectionId, FlyMenu> = {
    today: {
      title: t(SECTIONS[0]!.label),
      primary: [
        ...(course.next
          ? [
              {
                label: t(course.completed ? TEXT.continue : TEXT.start),
                note: `${lessonTitle(course.next)} · ${minutes(lang, course.next.minutes)}`,
                to: `/lesson/${course.next.id}`
              }
            ]
          : []),
        { label: t(TEXT.plan), to: "/dashboard" }
      ],
      columns: [{ title: t(TEXT.quick), links: quick }]
    },
    learn: {
      title: t(SECTIONS[1]!.label),
      primary: [
        {
          label: t(SECTIONS[1]!.label),
          note: `${t(TEXT.progress)}: ${course.completed}/${course.total}`,
          to: "/learn"
        },
        { label: t(TEXT.pronounce), to: "/pronunciation" }
      ],
      columns: course.upcoming.length
        ? [
            {
              title: t(TEXT.next),
              links: course.upcoming.map((lesson) => ({
                label: lessonTitle(lesson),
                note: minutes(lang, lesson.minutes),
                to: `/lesson/${lesson.id}`
              }))
            }
          ]
        : []
    },
    practice: {
      title: t(SECTIONS[2]!.label),
      primary: [
        { label: t(SECTIONS[2]!.label), to: "/practice" },
        { label: quick[0]!.label, to: "/review" }
      ],
      columns: [
        { title: t(TEXT.studios), links: STUDIOS.map(([to, label]) => ({ to, label: t(label) })) }
      ]
    },
    words: {
      title: t(SECTIONS[3]!.label),
      primary: [
        {
          label: t(SECTIONS[3]!.label),
          note: `${t(TEXT.words)}: ${wordsLearned}`,
          to: "/vocabulary"
        },
        { label: quick[0]!.label, to: "/review" }
      ],
      columns: [{ title: t(TEXT.quick), links: quick.slice(1) }]
    },
    progress: {
      title: t(SECTIONS[4]!.label),
      primary: [
        {
          label: t(SECTIONS[4]!.label),
          note: `${t(TEXT.progress)}: ${course.percent}%`,
          to: "/progress"
        },
        { label: t(MORE[0]![1]), to: MORE[0]![0] }
      ],
      columns: [
        {
          title: t(TEXT.more),
          links: MORE.slice(1).map(([to, label]) => ({ to, label: t(label) }))
        }
      ]
    }
  };
  const flyMenu = flyouts[fly ?? shown];

  const closeOnPlainClick = (event: MouseEvent) => {
    const plain =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (plain) setFly(null);
  };

  let menuIndex = 0;
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t(TEXT.skip)}
      </a>
      <header
        ref={headerRef}
        lang={lang}
        className={`globalnav${menuOpen ? " menuOpen" : ""}${fly ? " flyOpen" : ""}`}
        onPointerLeave={(event) => hoverFly(null, event)}
        onBlur={(event) => {
          if (fly && !event.currentTarget.contains(event.relatedTarget as Node | null))
            setFly(null);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !fly) return;
          headerRef.current?.querySelector<HTMLElement>(`[data-fly="${fly}"]`)?.focus();
          setFly(null);
        }}
      >
        <div className="topRow">
          <Link
            className="brand"
            to="/"
            aria-label={t(TEXT.home)}
            onPointerEnter={(event) => hoverFly(null, event)}
          >
            <span className="brand-mark" aria-hidden="true">
              <Languages />
            </span>
            <span className="brandText">
              LingoLanka<small>සිංහල · English</small>
            </span>
          </Link>

          <nav className="siteNav" aria-label={t(TEXT.main)}>
            <ul>
              {SECTIONS.map((item) => {
                const on = section === item.id;
                return (
                  <li
                    key={item.id}
                    className="navItem"
                    onPointerEnter={(event) => hoverFly(item.id, event)}
                  >
                    <NavLink
                      to={item.to}
                      className={on ? "navLink on" : "navLink"}
                      aria-current={on ? "page" : undefined}
                      onClick={closeOnPlainClick}
                    >
                      {t(item.label)}
                    </NavLink>
                    {/* The keyboard way into the panel, shown on focus. */}
                    <button
                      type="button"
                      className="flyToggle"
                      data-fly={item.id}
                      aria-expanded={fly === item.id}
                      aria-controls="nav-flyout"
                      aria-label={`${t(item.label)} · ${t(TEXT.openMenu)}`}
                      onClick={() => (fly === item.id ? setFly(null) : openFly(item.id))}
                    >
                      <svg viewBox="0 0 10 6" aria-hidden="true">
                        <path
                          d="M1 1l4 4 4-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="topActions" onPointerEnter={(event) => hoverFly(null, event)}>
            <NavLink
              to="/settings"
              className={({ isActive }) => `navIcon settingsGear${isActive ? " on" : ""}`}
              aria-label={t(MORE[1]![1])}
              title={t(MORE[1]![1])}
            >
              <Settings aria-hidden="true" />
            </NavLink>
            <button
              ref={menuButtonRef}
              type="button"
              className={menuOpen ? "menuBtn open" : "menuBtn"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={t(menuOpen ? TEXT.closeMenu : TEXT.openMenu)}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="menuGlyph" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>

        {/* The learner's place in the course, under the bar like a local nav. */}
        <div className="island">
          <span className="islandCourse">
            <span>{learningSinhala ? "EN" : "සිං"}</span>
            <span aria-hidden="true">→</span>
            <strong>{learningSinhala ? "සිං" : "EN"}</strong>
          </span>
          <span className="islandText">
            <b>
              {t(TEXT.progress)}: {course.completed}/{course.total}
            </b>
            {course.next && (
              <>
                {" · "}
                {t(TEXT.next)}: {lessonTitle(course.next)}
              </>
            )}
          </span>
          <span className="islandBar" aria-hidden="true">
            <i style={{ width: `${course.percent}%` }} />
          </span>
        </div>

        <NavFlyout menu={flyMenu} open={!!fly} onDone={() => setFly(null)} />
      </header>
      <div className={fly ? "flyScrim open" : "flyScrim"} aria-hidden="true" />

      {/* The same destinations, for screens too narrow to show them inline.
          Inert while closed, so it is neither focusable nor announced. */}
      <div
        id="site-menu"
        className={menuOpen ? "menuPanel open" : "menuPanel"}
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        lang={lang}
      >
        <nav aria-label={t(TEXT.mobile)}>
          <ul>
            {SECTIONS.map((item) => (
              <li key={item.id} style={{ "--i": menuIndex++ } as CSSProperties}>
                <NavLink
                  to={item.to}
                  className={section === item.id ? "menuLink on" : "menuLink"}
                  aria-current={section === item.id ? "page" : undefined}
                >
                  {t(item.label)}
                </NavLink>
              </li>
            ))}
          </ul>
          {(
            [
              [TEXT.studios, STUDIOS],
              [TEXT.more, [...QUICK.slice(0, 1), ["/pronunciation", TEXT.pronounce], ...MORE]]
            ] as [Copy, [string, Copy][]][]
          ).map(([title, links]) => (
            <section
              className="menuGroup"
              key={title.en}
              style={{ "--i": menuIndex++ } as CSSProperties}
            >
              <h2>{t(title)}</h2>
              <ul>
                {links.map(([to, label]) => (
                  <li key={to + label.en}>
                    <NavLink to={to}>{t(label)}</NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </>
  );
}
