import type { Transition } from "framer-motion";

/**
 * Motion tokens, expressed the way Apple's motion guidance is: a damping ratio
 * (how much it overshoots) and a response (how quickly it reaches the target).
 * Framer's `bounce` + `duration` spring maps onto that pair directly, which is
 * why these are written that way rather than as stiffness/damping/mass triplets
 * — those hide the damping ratio behind arithmetic and drift apart per component.
 *
 * The rule that decides which one to use: overshoot is only correct when the
 * gesture itself carried momentum — a flick, a throw, a drag release. Something
 * that merely appeared, or that moved because state changed, settles flat.
 * Bounce on a card that just mounted reads as noise.
 *
 * There is deliberately no momentum/flick token: nothing in the app is currently
 * thrown or flung. Add one (bounce ~0.2) alongside the first gesture that is.
 */

/** Default: anything appearing, moving or resizing on its own. No overshoot. */
export const springUI: Transition = { type: "spring", bounce: 0, duration: 0.4 };

/** Presses and other small changes that should feel immediate rather than settled. */
export const springPress: Transition = { type: "spring", bounce: 0, duration: 0.25 };

/** Reduced motion: keep the state change, drop the travel. */
export const instant: Transition = { duration: 0 };

/** Picks the right transition without repeating the ternary at every call site. */
export const motionOr = (reduced: boolean, transition: Transition): Transition =>
  reduced ? instant : transition;
