import {
  Award,
  BarChart3,
  BookMarked,
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
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

const navigation = [
  ["/dashboard", { en: "Dashboard", si: "ඉගෙනුම් පුවරුව" }, Gauge],
  ["/learn", { en: "Learn", si: "පාඩම්" }, GraduationCap],
  ["/alphabet", { en: "Alphabet", si: "අක්ෂර" }, SpellCheck2],
  ["/writing", { en: "Writing", si: "ලිවීම" }, PenTool],
  ["/listening", { en: "Listening", si: "සවන්දීම" }, Headphones],
  ["/speaking", { en: "Speaking", si: "කතා කිරීම" }, Mic2],
  ["/vocabulary", { en: "Vocabulary", si: "වචන මාලාව" }, Library],
  ["/grammar", { en: "Grammar", si: "ව්‍යාකරණ" }, BookOpen],
  ["/conversations", { en: "Conversations", si: "සංවාද" }, MessageCircle],
  ["/practice", { en: "Practice", si: "පුහුණුව" }, Sparkles],
  ["/review", { en: "Review", si: "පුනරීක්ෂණය" }, BookMarked],
  ["/progress", { en: "Progress", si: "ප්‍රගතිය" }, BarChart3],
  ["/achievements", { en: "Achievements", si: "ජයග්‍රහණ" }, Award],
  ["/settings", { en: "Settings", si: "සැකසුම්" }, Settings],
  ["/install", { en: "Install app", si: "යෙදුම ස්ථාපනය" }, Download],
  ["/about", { en: "About", si: "අප ගැන" }, CircleHelp],
  ["/privacy", { en: "Privacy", si: "පෞද්ගලිකත්වය" }, ShieldCheck]
] as const;

const mobileNavigation = [
  ["/dashboard", { en: "Home", si: "මුල් පිටුව" }, Gauge],
  ["/learn", { en: "Learn", si: "පාඩම්" }, GraduationCap],
  ["/practice", { en: "Practice", si: "පුහුණුව" }, Sparkles],
  ["/review", { en: "Review", si: "පුනරීක්ෂණය" }, BookMarked],
  ["/settings", { en: "Settings", si: "සැකසුම්" }, Settings]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { profile } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const language = profile.settings.interfaceLanguage;
  const text =
    language === "si"
      ? {
          skip: "ප්‍රධාන අන්තර්ගතයට යන්න",
          mainNavigation: "ප්‍රධාන මෙනුව",
          mobileNavigation: "ජංගම මෙනුව",
          home: "LingoLanka මුල් පිටුව",
          expand: "මෙනුව විවෘත කරන්න",
          collapse: "මෙනුව හකුළන්න"
        }
      : {
          skip: "Skip to main content",
          mainNavigation: "Main navigation",
          mobileNavigation: "Mobile navigation",
          home: "LingoLanka home",
          expand: "Expand navigation",
          collapse: "Collapse navigation"
        };

  return (
    <div className={`app-layout ${collapsed ? "nav-collapsed" : ""}`} lang={language}>
      <a className="skip-link" href="#main-content">
        {text.skip}
      </a>
      <aside className="sidebar" aria-label={text.mainNavigation}>
        <NavLink to="/" className="app-brand" aria-label={text.home}>
          <span className="brand-mark">
            <Languages />
          </span>
          <span>
            LingoLanka<small>සිංහල · English</small>
          </span>
        </NavLink>
        <nav>
          {navigation.map(([to, labels, Icon]) => (
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
        {children}
      </main>
      <nav className="bottom-nav" aria-label={text.mobileNavigation}>
        {mobileNavigation.map(([to, labels, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
            <Icon />
            <span>{labels[language]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
