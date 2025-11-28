import { Identifier, Guard, Result } from '@aob/shared';

export class CardId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Result<CardId> {
    const guardResult = Guard.combine([
      Guard.isNullOrEmpty(value, 'cardId'),
      Guard.lengthInRange(value, 1, 100, 'cardId'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    const kebabCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    const patternResult = Guard.matchesPattern(value, kebabCasePattern, 'cardId');

    if (patternResult.isFailure) {
      return Result.fail('CardId must be in kebab-case format (e.g., "btc-price")');
    }

    return Result.ok(new CardId(value));
  }

  public static fromTrustedSource(value: string): CardId {
    return new CardId(value);
  }

  public static createOrThrow(value: string): CardId {
    const result = this.create(value);
    if (result.isFailure) {
      throw new Error(`CardId creation failed: ${result.getError()}`);
    }
    return result.getValue();
  }
}
