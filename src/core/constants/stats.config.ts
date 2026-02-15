export const STATS_CONFIG = {
  BASE: {
    ATTACK_SPEED: 1.0, // Basis-Angriffe pro Sekunde
    DAMAGE: 0, // Basis-Schaden
    BLEEDING_CHANCE: 0.0, // 0% Base Bleeding Chance
    BLEEDING_DAMAGE: 0.25, // 25% Base Bleeding Damage
    BLEEDING_TICKS: 5, // Basis Anzahl Bleeding Ticks
    BLEEDING_TICK_INTERVAL_MS: 1000, // Basis Intervall zwischen Bleeding Ticks in Millisekunden
    CRIT_CHANCE: 0.0, // 0% Base CHC
    CRIT_DAMAGE: 1.5, // 150% Base CHD
    MULTI_HIT_CHANCE: 0.0, // 0% Base MHC
    MULTI_HIT_DAMAGE: 0.5, // 50% Base MHC
    MULTI_HIT_CHAIN_FACTOR: 0.4, // 40% Base Chain Factor
    ACCURACY: 0.7, // Basis-Accuracy
    ARMOR_PENETRATION: 0.1, // 10% Basis Armor Penetration
    RESISTANCE_PENETRATION: 0.1, // 10% Basis Magic Penetration
    CHARGE_GAIN: 1, // Basis Charge Gain
    CHARGE_DAMAGE: 1.5, // 150% Basis Charge Damage
    CHARGE_DURATION: 5, // Basis Charge Dauer in Sekunden
    CHARGE_MAX: 100 // Basis Maximaler Charge-Wert
  },
  LIMITS: {
    STR_TO_BLEED_CHANCE: 0.5, // Maximal +50% BHC durch STR
    STR_TO_BLEED_DAMAGE: 0.5, // Maximal +50% BHD durch STR
    INT_TO_CRIT_CHANCE: 0.5, // Maximal +50% CHC durch INT
    INT_TO_CRIT_DAMAGE: 3.0, // Maximal +300% CHD durch INT
    DEX_TO_MULTI_HIT_CHANCE: 0.5, // Maximal +50% MHC durch DEX
    DEX_TO_MULTI_HIT_DAMAGE: 1.0, // Maximal +100% MHD durch DEX
    DEX_TO_CHAIN_FACTOR: 0.7 // Maximal +70% MHCF durch DEX
  },
  CAPS: {
    MAX_BLEEDING_CHANCE: 0.9, // Maximal 90% BHC
    MAX_CRIT_CHANCE: 0.9, // Maximal 90% CHC
    MAX_MULTI_HIT_CHANCE: 0.9, // Maximal 90% MHC
    MAX_MULTI_HIT_CHAIN_FACTOR: 0.9, // Maximal 90% Chain Factor
    MAX_CHAIN_HITS: 6 // Maximal 6 Hits in Multi-Hit Chain
  },
  MAPPINGS: {
    // Attribute-Scaling (Attribute liegen effektiv bei 0..50)
    STR_K: 25,
    INT_K: 25,
    DEX_MULTI_HIT_K: 25,
    DEX_CHAIN_FACTOR_K: 35,

    // Softcap für "+X% Chance"-Quellen, die als MultiplierChance gemappt werden.
    // Je höher K, desto weniger stark wirken kleine +% Werte (langsamerer Start bei 0%).
    CHANCE_INCREASE_K: 1.8
  }
};
