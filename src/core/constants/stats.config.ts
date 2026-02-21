export const STATS_CONFIG = {
  BASE: {
    ATTACK_SPEED: 1.0, // Basis-Angriffe pro Sekunde
    DAMAGE: 1, // Basis-Schaden
    BLEEDING_CHANCE: 0.0, // 0% Base Bleeding Chance
    BLEEDING_DAMAGE: 0.25, // 25% Base Bleeding Damage
    BLEEDING_TICKS: 2, // Basis Anzahl Bleeding Ticks
    CRIT_CHANCE: 0.0, // 0% Base CHC
    CRIT_DAMAGE: 1.5, // 150% Base CHD
    MULTI_HIT_CHANCE: 0.0, // 0% Base MHC
    MULTI_HIT_DAMAGE: 0.5, // 50% Base MHD
    MULTI_HIT_CHAIN_FACTOR: 0.4, // 40% Base Chain Factor
    MULTI_HIT_CHAIN: 2, // 2 Base Chain Hits
    ACCURACY: 0.7, // Basis-Accuracy
    CHARGE_GAIN: 1, // Basis Charge Gain
    CHARGE_LOSS: 1.0, // 100% Basis Charge Loss
    CHARGE_DAMAGE: 1.5, // 150% Basis Charge Damage
    CHARGE_DURATION: 5, // Basis Charge Dauer in Sekunden
    CHARGE_MAX: 100 // Basis Maximaler Charge-Wert
  },
  LIMITS: {
    STR_TO_BLEED_CHANCE: 0.5, // Maximal +50% BHC durch STR
    STR_TO_BLEED_DAMAGE: 1.5, // Maximal +150% BHD durch STR
    INT_TO_CRIT_CHANCE: 0.5, // Maximal +50% CHC durch INT
    INT_TO_CRIT_DAMAGE: 3.0, // Maximal +300% CHD durch INT
    DEX_TO_MULTI_HIT_CHANCE: 0.5, // Maximal +50% MHC durch DEX
    DEX_TO_MULTI_HIT_DAMAGE: 1.0, // Maximal +100% MHD durch DEX
    DEX_TO_CHAIN_FACTOR: 0.2 // Maximal +20% MHCF durch DEX
  },
  CAPS: {
    MAX_ACCURACY: 1.0, // Maximal 100% Accuracy
    MAX_BLEEDING_CHANCE: 1.0, // Maximal 100% BHC
    MAX_BLEEDING_TICKS: 5, // Maximal 5 Bleeding Ticks
    MAX_CRIT_CHANCE: 1.0, // Maximal 100% CHC
    MAX_MULTI_HIT_CHANCE: 1.0, // Maximal 100% MHC
    MAX_MULTI_HIT_CHAIN_FACTOR: 0.9, // Maximal 90% Chain Factor
    MAX_CHAIN_HITS: 8, // Maximal 8 Hits in Multi-Hit Chain
    MAX_ATTACK_SPEED: 2.5 // Maximal 250% Angriffsgeschwindigkeit
  },
  MAPPINGS: {
    // Attribute-Scaling (Attribute liegen effektiv bei 0..50)
    STR_K: 50,
    INT_K: 50,
    DEX_K: 50
  }
};
