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

const navigation = [
  ["/dashboard", "Dashboard", Gauge],
  ["/learn", "Learn", GraduationCap],
  ["/alphabet", "Alphabet", SpellCheck2],
  ["/writing", "Writing", PenTool],
  ["/listening", "Listening", Headphones],
  ["/speaking", "Speaking", Mic2],
  ["/vocabulary", "Vocabulary", Library],
  ["/grammar", "Grammar", BookOpen],
  ["/conversations", "Conversations", MessageCircle],
  ["/practice", "Practice", Sparkles],
  ["/review", "Review", BookMarked],
  ["/progress", "Progress", BarChart3],
  ["/achievements", "Achievements", Award],
  ["/settings", "Settings", Settings],
  ["/install", "Install app", Download],
  ["/about", "About", CircleHelp],
  ["/privacy", "Privacy", ShieldCheck]
] as const;

const mobileNavigation = [
  ["/dashboard", "Home", Gauge],
  ["/learn", "Learn", GraduationCap],
  ["/practice", "Practice", Sparkles],
  ["/review", "Review", BookMarked],
  ["/settings", "Settings", Settings]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`app-layout ${collapsed ? "nav-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="sidebar" aria-label="Main navigation">
        <NavLink to="/" className="app-brand" aria-label="LingoLanka home">
          <span className="brand-mark">
            <Languages />
          </span>
          <span>
            LingoLanka<small>සිංහල · English</small>
          </span>
        </NavLink>
        <nav>
          {navigation.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          className="collapse-button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
          <span>{collapsed ? "" : "Collapse"}</span>
        </button>
      </aside>
      <main id="main-content" className="app-main">
        {children}
      </main>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {mobileNavigation.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
