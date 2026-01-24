export const STATS_CONFIG = {
  BASE: {
    BASE_HIT_CHANCE: 0.9, // Basis-Trefferchance
    BASE_ATTACK_SPEED: 1.0, // Basis-Angriffe pro Sekunde
    BASE_CRIT_CHANCE: 0.01, // 1% Base CHC
    BASE_CRIT_DAMAGE: 1.5, // 50% Base CHD
    BASE_MULTI_HIT_CHANCE: 0.1 // 10% Base MHC
  },
  LIMITS: {
    INT_TO_CRIT_CHANCE: 0.5, // Maximal +50% CHC durch INT
    DEX_TO_HASTE: 0.25, // Maximal +25% Haste durch DEX
    DEX_TO_MULTI_HIT: 0.35 // Maximal +35% MHC durch DEX
  },
  CAPS: {
    MAX_CRIT_CHANCE: 0.95, // Maximal 95% CHC
    MAX_MULTI_HIT_CHANCE: 0.9, // Maximal 90% MHC
    MAX_CHAIN_HITS: 8 // Maximal 8 Hits in Multi-Hit Chain
  },
  MAPPINGS: {
    STR_A: 0.02, // Skalierungsfaktor für STR zu Damage
    STR_B: 0.005, // Skalierungs-DR für STR zu Damage

    INT_K: 80, // Skalierungskonstante für INT

    DEX_HASTE_K: 120, // Skalierungskonstante für DEX to Haste

    DEX_MULTI_HIT_K: 80, // Skalierungskonstante für DEX to Multi-Hit

    DEX_BASE_ACCURACY: 0.0, // Basis-Accuracy durch DEX
    DEX_ACCURACY_A: 0.03, // Skalierungsfaktor für DEX zu Accuracy

    DEX_BASE_EVASION: 0.0, // Basis-Evasion durch DEX
    DEX_EVASION_A: 0.02, // Skalierungsfaktor für DEX zu Evasion

    // Wertebereich [0.55 .. 0.8]
    DEX_CHAIN_FACTOR_MIN: 0.55, // Minimale Chain Factor
    DEX_CHAIN_FACTOR_MAX: 0.8, // Maximale Chain Factor
    DEX_CHAIN_FACTOR_K: 180 // Skalierungskonstante für DEX zu Chain Factor
  }
};
