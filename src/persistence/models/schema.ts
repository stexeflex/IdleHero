import {
  Boots,
  Chest,
  DamageStatistics,
  Head,
  Legs,
  Shield,
  SkillTreeState,
  StageStatistics,
  Weapon
} from '../../shared/models';
import { CHARACTER_CONFIG, CURRENCY_CONFIG, STATS_CONFIG } from '../../shared/constants';
import { FallbackUtils, ObjectUtils } from '../../shared/utils';

import { environment } from '../../environment/environment';

export class Schema {
  Version: string;
  TimeStamp: Date;

  GameState: GameStateSchema = new GameStateSchema();
  Statistics: StatisticsSchema = new StatisticsSchema();
  Hero: HeroSchema = new HeroSchema();
  Level: LevelSchema = new LevelSchema();
  Attributes: AttributesSchema = new AttributesSchema();
  Skills: SkillSchema = new SkillSchema();
  Inventory: InventorySchema = new InventorySchema();
  Currency: CurrencySchema = new CurrencySchema();

  constructor() {
    this.Version = environment.version;
    this.TimeStamp = new Date(Date.now());
  }

  public static FromRaw(applyTo: Schema, raw: unknown): Schema {
    if (!ObjectUtils.isPlainObject(raw)) {
      return applyTo;
    }

    // Version
    this.SetVersionFromRaw(applyTo, raw);

    // TimeStamp
    this.SetTimeStampFromRaw(applyTo, raw);

    // GameState
    applyTo.GameState = GameStateSchema.FromRaw(applyTo.GameState, raw);

    // Statistics
    applyTo.Statistics = StatisticsSchema.FromRaw(applyTo.Statistics, raw);

    // Hero
    applyTo.Hero = HeroSchema.FromRaw(applyTo.Hero, raw);

    // Level
    applyTo.Level = LevelSchema.FromRaw(applyTo.Level, raw);

    // Stats
    applyTo.Attributes = AttributesSchema.FromRaw(applyTo.Attributes, raw);

    // Skills
    applyTo.Skills = SkillSchema.FromRaw(applyTo.Skills, raw);

    // Inventory
    applyTo.Inventory = InventorySchema.FromRaw(applyTo.Inventory, raw);

    // Currency
    applyTo.Currency = CurrencySchema.FromRaw(applyTo.Currency, raw);

    return applyTo;
  }

  private static SetVersionFromRaw(applyTo: Schema, raw: unknown): void {
    if (typeof (raw as any).Version === 'string') {
      applyTo.Version = (raw as any).Version as string;
    }
  }

  private static SetTimeStampFromRaw(applyTo: Schema, raw: unknown): void {
    if (typeof (raw as any).TimeStamp === 'string') {
      const parsedDate = new Date((raw as any).TimeStamp);

      if (!isNaN(parsedDate.getTime())) {
        applyTo.TimeStamp = parsedDate;
      }
    }
  }
}

export class GameStateSchema {
  GameCreated: boolean = false;

  public static FromRaw(applyTo: GameStateSchema, raw: unknown): GameStateSchema {
    const gameState = (raw as any).GameState;
    applyTo.GameCreated = FallbackUtils.pickBoolean(gameState?.GameCreated, applyTo.GameCreated);
    return applyTo;
  }
}

export class StatisticsSchema {
  Prestiges: number = 0;
  StageStatistics: StageStatistics = { HighestStageReached: {} };

  DamageStatistics: DamageStatistics = {
    HighestSingleHit: 0,
    HighestCriticalHit: 0,
    HighestMultiHit: 0,
    HighestCriticalMultiHit: 0,
    HighestSplashHit: 0
  };

  public static FromRaw(applyTo: StatisticsSchema, raw: unknown): StatisticsSchema {
    const stats = (raw as any).Statistics;

    applyTo.Prestiges = FallbackUtils.pickNumber(stats?.Prestiges, applyTo.Prestiges);

    const stageStats = stats?.StageStatistics?.HighestStageReached;
    if (ObjectUtils.isPlainObject(stageStats)) {
      for (const [key, value] of Object.entries(stageStats)) {
        applyTo.StageStatistics.HighestStageReached[Number(key)] = FallbackUtils.pickNumber(
          value,
          0
        );
      }
    }

    const damageStats = stats?.DamageStatistics;
    applyTo.DamageStatistics.HighestSingleHit = FallbackUtils.pickNumber(
      damageStats?.HighestSingleHit,
      applyTo.DamageStatistics.HighestSingleHit
    );
    applyTo.DamageStatistics.HighestCriticalHit = FallbackUtils.pickNumber(
      damageStats?.HighestCriticalHit,
      applyTo.DamageStatistics.HighestCriticalHit
    );
    applyTo.DamageStatistics.HighestMultiHit = FallbackUtils.pickNumber(
      damageStats?.HighestMultiHit,
      applyTo.DamageStatistics.HighestMultiHit
    );
    applyTo.DamageStatistics.HighestCriticalMultiHit = FallbackUtils.pickNumber(
      damageStats?.HighestCriticalMultiHit,
      applyTo.DamageStatistics.HighestCriticalMultiHit
    );
    applyTo.DamageStatistics.HighestSplashHit = FallbackUtils.pickNumber(
      damageStats?.HighestSplashHit,
      applyTo.DamageStatistics.HighestSplashHit
    );
    return applyTo;
  }
}

export class HeroSchema {
  Name: string = 'Hero';
  CharacterIcon: string = 'dwarf';
  PrestigeLevel: number = 0;
  HighestStageReached: number = 0;
  HighestDamageDealt: number = 0;

  public static FromRaw(applyTo: HeroSchema, raw: unknown): HeroSchema {
    const hero = (raw as any).Hero;
    applyTo.Name = FallbackUtils.pickString(hero?.Name, applyTo.Name);
    applyTo.CharacterIcon = FallbackUtils.pickString(hero?.CharacterIcon, applyTo.CharacterIcon);
    applyTo.PrestigeLevel = FallbackUtils.pickNumber(hero?.PrestigeLevel, applyTo.PrestigeLevel);
    applyTo.HighestStageReached = FallbackUtils.pickNumber(
      hero?.HighestStageReached,
      applyTo.HighestStageReached
    );
    applyTo.HighestDamageDealt = FallbackUtils.pickNumber(
      hero?.HighestDamageDealt,
      applyTo.HighestDamageDealt
    );

    return applyTo;
  }
}

export class LevelSchema {
  Level: number = CHARACTER_CONFIG.LEVEL.BASE_LEVEL;
  Experience: number = CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE;
  SpentAttributePoints: number = 0;

  public static FromRaw(applyTo: LevelSchema, raw: unknown): LevelSchema {
    const level = (raw as any).Level;
    applyTo.Level = FallbackUtils.pickNumber(level?.Level, applyTo.Level);
    applyTo.Experience = FallbackUtils.pickNumber(level?.Experience, applyTo.Experience);
    applyTo.SpentAttributePoints = FallbackUtils.pickNumber(
      level?.SpentAttributePoints,
      applyTo.SpentAttributePoints
    );
    return applyTo;
  }
}

export class AttributesSchema {
  Strength: number = STATS_CONFIG.ATTRIBUTES.STRENGTH_BASE;
  Intelligence: number = STATS_CONFIG.ATTRIBUTES.INTELLIGENCE_BASE;
  Dexterity: number = STATS_CONFIG.ATTRIBUTES.DEXTERITY_BASE;

  public static FromRaw(applyTo: AttributesSchema, raw: unknown): AttributesSchema {
    const stats = (raw as any).Attributes;
    applyTo.Strength = FallbackUtils.pickNumber(stats?.Strength, applyTo.Strength);
    applyTo.Intelligence = FallbackUtils.pickNumber(stats?.Intelligence, applyTo.Intelligence);
    applyTo.Dexterity = FallbackUtils.pickNumber(stats?.Dexterity, applyTo.Dexterity);
    return applyTo;
  }
}

export class SkillSchema {
  SkillTreeState: SkillTreeState = { TierState: {}, SkillState: {} };

  public static FromRaw(applyTo: SkillSchema, raw: unknown): SkillSchema {
    const skills = (raw as any).Skills;
    const tierStateRaw = skills?.SkillTreeState?.TierState;
    const skillStateRaw = skills?.SkillTreeState?.SkillState;

    if (ObjectUtils.isPlainObject(tierStateRaw)) {
      for (const [key, value] of Object.entries(tierStateRaw)) {
        applyTo.SkillTreeState.TierState[Number(key)] = FallbackUtils.pickBoolean(value, false);
      }
    }

    if (ObjectUtils.isPlainObject(skillStateRaw)) {
      for (const [key, value] of Object.entries(skillStateRaw)) {
        applyTo.SkillTreeState.SkillState[key] = FallbackUtils.pickNumber(value, 0);
      }
    }

    return applyTo;
  }
}

export class InventorySchema {
  Weapon: Weapon | null = null;
  Shield: Shield | null = null;
  Head: Head | null = null;
  Chest: Chest | null = null;
  Legs: Legs | null = null;
  Boots: Boots | null = null;

  public static FromRaw(applyTo: InventorySchema, raw: unknown): InventorySchema {
    const inv = (raw as any).Inventory;
    applyTo.Weapon = FallbackUtils.pickNullableObject(inv?.Weapon, applyTo.Weapon);
    applyTo.Shield = FallbackUtils.pickNullableObject(inv?.Shield, applyTo.Shield);
    applyTo.Head = FallbackUtils.pickNullableObject(inv?.Head, applyTo.Head);
    applyTo.Chest = FallbackUtils.pickNullableObject(inv?.Chest, applyTo.Chest);
    applyTo.Legs = FallbackUtils.pickNullableObject(inv?.Legs, applyTo.Legs);
    applyTo.Boots = FallbackUtils.pickNullableObject(inv?.Boots, applyTo.Boots);
    return applyTo;
  }
}

export class CurrencySchema {
  Gold: number = CURRENCY_CONFIG.GOLD.STARTING_AMOUNT;
  SilverKey: boolean = CURRENCY_CONFIG.KEYS.HAS_SILVER_KEY;
  MagicKey: boolean = CURRENCY_CONFIG.KEYS.HAS_MAGIC_KEY;
  GoldenKey: boolean = CURRENCY_CONFIG.KEYS.HAS_GOLDEN_KEY;

  public static FromRaw(applyTo: CurrencySchema, raw: unknown): CurrencySchema {
    const currency = (raw as any).Currency;
    applyTo.Gold = FallbackUtils.pickNumber(currency?.Gold, applyTo.Gold);
    applyTo.SilverKey = FallbackUtils.pickBoolean(currency?.SilverKey, applyTo.SilverKey);
    applyTo.MagicKey = FallbackUtils.pickBoolean(currency?.MagicKey, applyTo.MagicKey);
    applyTo.GoldenKey = FallbackUtils.pickBoolean(currency?.GoldenKey, applyTo.GoldenKey);
    return applyTo;
  }
}
