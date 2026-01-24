import { AttackTickContext } from './attack-tick-context';

/** Signature of attack-tick handlers */
export type AttackTickHandler = (ctx: AttackTickContext) => void;
