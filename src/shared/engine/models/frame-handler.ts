/** Signature of per-frame handlers */
export type FrameHandler = (now: number, deltaSec: number) => void;
