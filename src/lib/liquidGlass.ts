import type { PointerEvent as ReactPointerEvent } from "react";

type GlassElement = HTMLElement & {
  style: CSSStyleDeclaration;
};

const setGlassPoint = (element: GlassElement, clientX: number, clientY: number) => {
  const bounds = element.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;

  const x = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100));
  const y = Math.min(100, Math.max(0, ((clientY - bounds.top) / bounds.height) * 100));
  element.style.setProperty("--glass-x", `${x.toFixed(1)}%`);
  element.style.setProperty("--glass-y", `${y.toFixed(1)}%`);
};

export const moveLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  setGlassPoint(event.currentTarget, event.clientX, event.clientY);
  event.currentTarget.style.setProperty("--glass-energy", "0.58");
};

export const pressLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  setGlassPoint(event.currentTarget, event.clientX, event.clientY);
  event.currentTarget.style.setProperty("--glass-energy", "1");
};

export const releaseLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  event.currentTarget.style.setProperty("--glass-energy", "0.34");
};

export const resetLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  event.currentTarget.style.setProperty("--glass-x", "50%");
  event.currentTarget.style.setProperty("--glass-y", "0%");
  event.currentTarget.style.setProperty("--glass-energy", "0.18");
};
