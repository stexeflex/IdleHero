import { SkillId } from './skill-id';

export abstract class Skill {
  public Level: number = 0;

  constructor(
    public readonly Id: SkillId,
    public readonly Name: string,
    public readonly MaxLevel: number,
    public readonly Dependencies: SkillId[] = []
  ) {}

  public abstract GetDescription(level: number): string;
}

export class SkillAttackPower extends Skill {
  private static readonly MAX_LEVEL = 5;

  constructor() {
    super(new SkillId(1, 1), 'Basic Attack', SkillAttackPower.MAX_LEVEL, []);
  }

  public GetDescription(level: number): string {
    switch (level) {
      case 1:
        return 'Increases attack power by 10.';
      case 2:
        return 'Increases attack power by 20.';
      case 3:
        return 'Increases attack power by 30.';
      case 4:
        return 'Increases attack power by 40.';
      case 5:
        return 'Increases attack power by 50.';
      default:
        return 'Increases attack power by 10.';
    }
  }
}

export class SkillAttackSpeed extends Skill {
  private static readonly MAX_LEVEL = 5;
  constructor() {
    super(new SkillId(1, 2), 'Attack Speed', SkillAttackSpeed.MAX_LEVEL, []);
  }

  public GetDescription(level: number): string {
    switch (level) {
      case 1:
        return 'Increases attack speed by 10%.';
      case 2:
        return 'Increases attack speed by 20%.';
      case 3:
        return 'Increases attack speed by 30%.';
      case 4:
        return 'Increases attack speed by 40%.';
      case 5:
        return 'Increases attack speed by 50%.';
      default:
        return 'Increases attack speed by 10%.';
    }
  }
}

export class SkillForTree2 extends Skill {
  private static readonly MAX_LEVEL = 3;
  constructor() {
    super(new SkillId(2, 1), 'Skill for Tree 2', SkillForTree2.MAX_LEVEL, [new SkillId(1, 1)]);
  }

  public GetDescription(level: number): string {
    switch (level) {
      case 1:
        return 'Description for Skill for Tree 2 at level 1.';
      case 2:
        return 'Description for Skill for Tree 2 at level 2.';
      case 3:
        return 'Description for Skill for Tree 2 at level 3.';
      default:
        return 'Description for Skill for Tree 2 at level 1.';
    }
  }
}

export class SkillForTree3 extends Skill {
  private static readonly MAX_LEVEL = 4;
  constructor() {
    super(new SkillId(3, 1), 'Skill for Tree 3', SkillForTree3.MAX_LEVEL, [new SkillId(2, 1)]);
  }

  public GetDescription(level: number): string {
    switch (level) {
      case 1:
        return 'Description for Skill for Tree 3 at level 1.';
      case 2:
        return 'Description for Skill for Tree 3 at level 2.';
      case 3:
        return 'Description for Skill for Tree 3 at level 3.';
      case 4:
        return 'Description for Skill for Tree 3 at level 4.';
      default:
        return 'Description for Skill for Tree 3 at level 1.';
    }
  }
}
