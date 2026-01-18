export class SkillId {
  constructor(
    public readonly Tier: number,
    public readonly Skill: number
  ) {}

  toString(): string {
    return `${this.Tier}-${this.Skill}`;
  }
}
