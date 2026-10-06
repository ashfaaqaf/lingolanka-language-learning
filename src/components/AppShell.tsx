import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { instant, springUI } from "../lib/motion";
import { GlobalNav } from "./GlobalNav";

export function AppShell({ children }: { children: ReactNode }) {
  const { profile } = useApp();
  const location = useLocation();
  const reduceMotion = useReducedMotion() || profile.settings.reducedMotion;

  return (
    <div className="app-layout" lang={profile.settings.interfaceLanguage}>
      <GlobalNav />
      <main id="main-content" className="app-main">
        {/* The nav sits outside this stage, so it holds still while the page
            beneath it crossfades and settles upward. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-stage"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
            transition={
              reduceMotion
                ? instant
                : {
                    // Enter on the standard spring; exit on a short tween so
                    // mode="wait" does not spend a full settle before content appears.
                    default: springUI,
                    opacity: { duration: 0.12, ease: "linear" }
                  }
            }
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
