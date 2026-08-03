import type { PointerEvent as ReactPointerEvent } from "react";

type GlassElement = HTMLElement & {
  style: CSSStyleDeclaration;
};

type PendingGlassPoint = {
  clientX: number;
  clientY: number;
  frame: number;
};

const pendingGlassPoints = new WeakMap<GlassElement, PendingGlassPoint>();

const setGlassPoint = (element: GlassElement, clientX: number, clientY: number) => {
  const bounds = element.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;

  const x = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100));
  const y = Math.min(100, Math.max(0, ((clientY - bounds.top) / bounds.height) * 100));
  const horizontalDrift = ((x - 50) / 50) * 5;
  const verticalDrift = ((y - 50) / 50) * 4;
  element.style.setProperty("--glass-x", `${x.toFixed(1)}%`);
  element.style.setProperty("--glass-y", `${y.toFixed(1)}%`);
  element.style.setProperty("--glass-shift-x", `${horizontalDrift.toFixed(2)}px`);
  element.style.setProperty("--glass-shift-y", `${verticalDrift.toFixed(2)}px`);
};

const cancelPendingGlassPoint = (element: GlassElement) => {
  const pending = pendingGlassPoints.get(element);
  if (!pending) return;

  window.cancelAnimationFrame(pending.frame);
  pendingGlassPoints.delete(element);
};

const scheduleGlassPoint = (element: GlassElement, clientX: number, clientY: number) => {
  const pending = pendingGlassPoints.get(element);
  if (pending) {
    pending.clientX = clientX;
    pending.clientY = clientY;
    return;
  }

  const nextPoint: PendingGlassPoint = { clientX, clientY, frame: 0 };
  nextPoint.frame = window.requestAnimationFrame(() => {
    setGlassPoint(element, nextPoint.clientX, nextPoint.clientY);
    pendingGlassPoints.delete(element);
  });
  pendingGlassPoints.set(element, nextPoint);
};

export const moveLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  scheduleGlassPoint(event.currentTarget, event.clientX, event.clientY);
  event.currentTarget.style.setProperty(
    "--glass-energy",
    event.pointerType === "touch" ? "0.72" : "0.46"
  );
  event.currentTarget.style.setProperty("--glass-flex-scale", "1.035");
};

export const pressLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  cancelPendingGlassPoint(event.currentTarget);
  setGlassPoint(event.currentTarget, event.clientX, event.clientY);
  event.currentTarget.style.setProperty("--glass-energy", "1");
  event.currentTarget.style.setProperty(
    "--glass-flex-scale",
    event.pointerType === "touch" ? "1.075" : "1.05"
  );
};

export const releaseLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  event.currentTarget.style.setProperty("--glass-energy", "0.34");
  event.currentTarget.style.setProperty("--glass-flex-scale", "1.025");
};

export const resetLiquidGlass = (event: ReactPointerEvent<HTMLElement>) => {
  cancelPendingGlassPoint(event.currentTarget);
  event.currentTarget.style.setProperty("--glass-x", "50%");
  event.currentTarget.style.setProperty("--glass-y", "0%");
  event.currentTarget.style.setProperty("--glass-shift-x", "0px");
  event.currentTarget.style.setProperty("--glass-shift-y", "0px");
  event.currentTarget.style.setProperty("--glass-flex-scale", "1.02");
  event.currentTarget.style.setProperty("--glass-energy", "0.18");
};
