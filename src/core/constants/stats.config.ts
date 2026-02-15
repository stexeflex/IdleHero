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
    INT_TO_CRIT_CHANCE: 0.5, // Maximal +50% CHC durch INT
    DEX_TO_HASTE: 0.25, // Maximal +25% Haste durch DEX
    DEX_TO_MULTI_HIT_CHANCE: 0.35, // Maximal +35% MHC durch DEX
    DEX_TO_MULTI_HIT_DAMAGE: 2.0, // Maximal 200% MHD durch DEX
    DEX_TO_CHAIN_FACTOR: 0.8 // Maximale Chain Factor durch DEX
  },
  CAPS: {
    MAX_BLEEDING_CHANCE: 0.9, // Maximal 90% BHC
    MAX_CRIT_CHANCE: 0.9, // Maximal 90% CHC
    MAX_MULTI_HIT_CHANCE: 0.9, // Maximal 90% MHC
    MAX_MULTI_HIT_CHAIN_FACTOR: 0.9, // Maximal 90% Chain Factor
    MAX_CHAIN_HITS: 8 // Maximal 8 Hits in Multi-Hit Chain
  },
  MAPPINGS: {
    STR_A: 0.02, // Skalierungsfaktor für STR zu Damage
    STR_B: 0.005, // Skalierungs-DR für STR zu Damage

    STR_K: 80, // Skalierungskonstante für STR
    INT_K: 80, // Skalierungskonstante für INT

    DEX_HASTE_K: 120, // Skalierungskonstante für DEX to Haste

    DEX_MULTI_HIT_K: 80, // Skalierungskonstante für DEX to Multi-Hit Damage
    DEX_CHAIN_FACTOR_K: 180, // Skalierungskonstante für DEX zu Chain Factor

    DEX_BASE_ACCURACY: 0.0, // Basis-Accuracy durch DEX
    DEX_ACCURACY_A: 0.03, // Skalierungsfaktor für DEX zu Accuracy

    DEX_BASE_EVASION: 0.0, // Basis-Evasion durch DEX
    DEX_EVASION_A: 0.02, // Skalierungsfaktor für DEX zu Evasion

    STR_ARMOR_PENETRATION_K: 100, // Skalierungskonstante für STR to Armor Penetration
    INT_RESISTANCE_PENETRATION_K: 100 // Skalierungskonstante für INT to Magic Penetration
  }
};
