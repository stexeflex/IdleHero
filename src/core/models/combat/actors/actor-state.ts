export interface ActorState {
  IsBleeding: boolean;
  BleedingState: {
    Tick: number;
    TotalTicks: number;
  } | null;
}

export function InitialActorState(): ActorState {
  return {
    IsBleeding: false,
    BleedingState: null
  };
}
