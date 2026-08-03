import {
  Award,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Gauge,
  GraduationCap,
  Headphones,
  Languages,
  Library,
  MessageCircle,
  Mic2,
  PenTool,
  Settings,
  ShieldCheck,
  Sparkles,
  SpellCheck2
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  moveLiquidGlass,
  pressLiquidGlass,
  releaseLiquidGlass,
  resetLiquidGlass
} from "../lib/liquidGlass";

const primaryNavigation = [
  ["/dashboard", { en: "Today", si: "අද" }, Gauge],
  ["/learn", { en: "Learning path", si: "ඉගෙනුම් මාර්ගය" }, GraduationCap],
  ["/practice", { en: "Practice", si: "පුහුණුව" }, Sparkles],
  ["/vocabulary", { en: "Wordbook", si: "වචන පොත" }, Library],
  ["/progress", { en: "Progress", si: "ප්‍රගතිය" }, BarChart3]
] as const;

const skillNavigation = [
  ["/alphabet", { en: "Alphabet", si: "අක්ෂර" }, SpellCheck2],
  ["/writing", { en: "Writing", si: "ලිවීම" }, PenTool],
  ["/listening", { en: "Listening", si: "සවන්දීම" }, Headphones],
  ["/speaking", { en: "Speaking", si: "කතා කිරීම" }, Mic2],
  ["/grammar", { en: "Grammar", si: "ව්‍යාකරණ" }, BookOpen],
  ["/conversations", { en: "Conversations", si: "සංවාද" }, MessageCircle]
] as const;

const utilityNavigation = [
  ["/achievements", { en: "Milestones", si: "ජයග්‍රහණ" }, Award],
  ["/settings", { en: "Settings", si: "සැකසුම්" }, Settings],
  ["/install", { en: "Install app", si: "යෙදුම ස්ථාපනය" }, Download],
  ["/about", { en: "About", si: "අප ගැන" }, CircleHelp],
  ["/privacy", { en: "Privacy", si: "පෞද්ගලිකත්වය" }, ShieldCheck]
] as const;

const mobileNavigation = primaryNavigation;

type Language = "en" | "si";
type NavigationGroup = typeof primaryNavigation | typeof skillNavigation | typeof utilityNavigation;

function NavigationSection({
  label,
  items,
  language,
  collapsed
}: {
  label: string;
  items: NavigationGroup;
  language: Language;
  collapsed: boolean;
}) {
  return (
    <div className="nav-section">
      {!collapsed && <span className="nav-section-label">{label}</span>}
      {items.map(([to, labels, Icon]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title={collapsed ? labels[language] : undefined}
        >
          <Icon aria-hidden="true" />
          <span>{labels[language]}</span>
        </NavLink>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { profile } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion() || profile.settings.reducedMotion;
  const language = profile.settings.interfaceLanguage;
  const learningSinhala = profile.settings.direction === "english-to-sinhala";
  const text =
    language === "si"
      ? {
          skip: "ප්‍රධාන අන්තර්ගතයට යන්න",
          mainNavigation: "ප්‍රධාන මෙනුව",
          mobileNavigation: "ජංගම මෙනුව",
          home: "LingoLanka මුල් පිටුව",
          expand: "මෙනුව විවෘත කරන්න",
          collapse: "මෙනුව හකුළන්න",
          daily: "දිනපතා ඉගෙනීම",
          studios: "කුසලතා පුහුණුව",
          more: "තවත්",
          direction: learningSinhala ? "ඉංග්‍රීසි සිට සිංහල" : "සිංහල සිට ඉංග්‍රීසි"
        }
      : {
          skip: "Skip to main content",
          mainNavigation: "Main navigation",
          mobileNavigation: "Mobile navigation",
          home: "LingoLanka home",
          expand: "Expand navigation",
          collapse: "Collapse navigation",
          daily: "Daily learning",
          studios: "Skill studios",
          more: "More",
          direction: learningSinhala ? "English to Sinhala" : "Sinhala to English"
        };

  return (
    <div className={`app-layout ${collapsed ? "nav-collapsed" : ""}`} lang={language}>
      <a className="skip-link" href="#main-content">
        {text.skip}
      </a>
      <aside
        className="sidebar liquid-glass"
        aria-label={text.mainNavigation}
        onPointerMove={moveLiquidGlass}
        onPointerDown={pressLiquidGlass}
        onPointerUp={releaseLiquidGlass}
        onPointerCancel={resetLiquidGlass}
        onPointerLeave={resetLiquidGlass}
      >
        <NavLink to="/" className="app-brand" aria-label={text.home}>
          <span className="brand-mark">
            <Languages />
          </span>
          <span>
            LingoLanka<small>සිංහල · English</small>
          </span>
        </NavLink>
        {!collapsed && (
          <div className="course-pill">
            <span>{learningSinhala ? "EN" : "සිං"}</span>
            <ChevronRight aria-hidden="true" />
            <strong>{learningSinhala ? "සිං" : "EN"}</strong>
            <small>{text.direction}</small>
          </div>
        )}
        <nav>
          <NavigationSection
            label={text.daily}
            items={primaryNavigation}
            language={language}
            collapsed={collapsed}
          />
          <NavigationSection
            label={text.studios}
            items={skillNavigation}
            language={language}
            collapsed={collapsed}
          />
          <NavigationSection
            label={text.more}
            items={utilityNavigation}
            language={language}
            collapsed={collapsed}
          />
        </nav>
        <button
          className="collapse-button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? text.expand : text.collapse}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
          <span>{collapsed ? "" : text.collapse}</span>
        </button>
      </aside>
      <main id="main-content" className="app-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-stage"
            initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -5, filter: "blur(2px)" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 38, mass: 0.7 }
            }
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav
        className="bottom-nav liquid-glass"
        aria-label={text.mobileNavigation}
        onPointerMove={moveLiquidGlass}
        onPointerDown={pressLiquidGlass}
        onPointerUp={releaseLiquidGlass}
        onPointerCancel={resetLiquidGlass}
        onPointerLeave={resetLiquidGlass}
      >
        {mobileNavigation.map(([to, labels, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
            <Icon aria-hidden="true" />
            <span>{labels[language]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
