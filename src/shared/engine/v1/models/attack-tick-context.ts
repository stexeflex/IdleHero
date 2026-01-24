/** Context passed to attack-tick handlers */
export interface AttackTickContext {
  /** High-resolution time (ms) of the current frame */
  now: number;
  /** Elapsed seconds since the previous frame (clamped) */
  elapsedSec: number;
  /** Monotonic attack counter for ordering and debugging */
  attackIndex: number;
}
