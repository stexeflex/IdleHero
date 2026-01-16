import { Boots, Chest, Head, Legs, Shield, Weapon } from '../../shared/models';
import { CHARACTER_CONFIG, CURRENCY_CONFIG, STATS_CONFIG } from '../../shared/constants';
import { FallbackUtils, ObjectUtils } from '../../shared/utils';

import { environment } from '../../environment/environment';

export class Schema {
  Version: string;
  TimeStamp: Date;

  GameState: GameStateSchema = new GameStateSchema();
  Hero: HeroSchema = new HeroSchema();
  Level: LevelSchema = new LevelSchema();
  Stats: StatsSchema = new StatsSchema();
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

    // Hero
    applyTo.Hero = HeroSchema.FromRaw(applyTo.Hero, raw);

    // Level
    applyTo.Level = LevelSchema.FromRaw(applyTo.Level, raw);

    // Stats
    applyTo.Stats = StatsSchema.FromRaw(applyTo.Stats, raw);

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

export class HeroSchema {
  Name: string = 'Hero';
  CharacterIcon: string = 'dwarf';
  PrestigeLevel: number = 0;
  HighestStageReached: number = 0;

  public static FromRaw(applyTo: HeroSchema, raw: unknown): HeroSchema {
    const hero = (raw as any).Hero;
    applyTo.Name = FallbackUtils.pickString(hero?.Name, applyTo.Name);
    applyTo.CharacterIcon = FallbackUtils.pickString(hero?.CharacterIcon, applyTo.CharacterIcon);
    applyTo.PrestigeLevel = FallbackUtils.pickNumber(hero?.PrestigeLevel, applyTo.PrestigeLevel);
    applyTo.HighestStageReached = FallbackUtils.pickNumber(
      hero?.HighestStageReached,
      applyTo.HighestStageReached
    );

    return applyTo;
  }
}

export class LevelSchema {
  Level: number = CHARACTER_CONFIG.LEVEL.BASE_LEVEL;
  Experience: number = CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE;
  ExperienceToNextLevel: number = CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE_TO_NEXT_LEVEL;
  UnspentSkillPoints: number = 0;
  SpentSkillPoints: number = 0;
  TotalSkillPoints: number = 0;

  public static FromRaw(applyTo: LevelSchema, raw: unknown): LevelSchema {
    const level = (raw as any).Level;
    applyTo.Level = FallbackUtils.pickNumber(level?.Level, applyTo.Level);
    applyTo.UnspentSkillPoints = FallbackUtils.pickNumber(
      level?.UnspentSkillPoints,
      applyTo.UnspentSkillPoints
    );
    applyTo.SpentSkillPoints = FallbackUtils.pickNumber(
      level?.SpentSkillPoints,
      applyTo.SpentSkillPoints
    );
    applyTo.TotalSkillPoints = FallbackUtils.pickNumber(
      level?.TotalSkillPoints,
      applyTo.TotalSkillPoints
    );
    return applyTo;
  }
}

export class StatsSchema {
  Strength: number = STATS_CONFIG.ATTRIBUTES.STRENGTH_BASE;
  Intelligence: number = STATS_CONFIG.ATTRIBUTES.INTELLIGENCE_BASE;
  Dexterity: number = STATS_CONFIG.ATTRIBUTES.DEXTERITY_BASE;

  public static FromRaw(applyTo: StatsSchema, raw: unknown): StatsSchema {
    const stats = (raw as any).Stats;
    applyTo.Strength = FallbackUtils.pickNumber(stats?.Strength, applyTo.Strength);
    applyTo.Intelligence = FallbackUtils.pickNumber(stats?.Intelligence, applyTo.Intelligence);
    applyTo.Dexterity = FallbackUtils.pickNumber(stats?.Dexterity, applyTo.Dexterity);
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

  public static FromRaw(applyTo: CurrencySchema, raw: unknown): CurrencySchema {
    const currency = (raw as any).Currency;
    applyTo.Gold = FallbackUtils.pickNumber(currency?.Gold, applyTo.Gold);
    return applyTo;
  }
}
