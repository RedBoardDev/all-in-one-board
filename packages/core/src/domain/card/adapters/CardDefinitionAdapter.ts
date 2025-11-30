import { Result } from '@aob/shared';
import type { CardDefinition, CardBehaviorConfig } from '../interfaces/CardDefinition.interface';
import { CardModel } from '../entities/CardModel.entity';
import { CardBehavior as CardBehaviorVO } from '../value-objects/CardBehavior.vo';

export class CardDefinitionAdapter {
  public static toCardModel<TData>(cardDefinition: CardDefinition<TData>): Result<CardModel<TData>> {
    const behaviorResult = this.convertCardBehavior(cardDefinition.behavior);
    if (behaviorResult.isFailure) {
      return Result.fail(behaviorResult.getError());
    }

    return CardModel.create<TData>({
      id: cardDefinition.id,
      title: cardDefinition.title,
      layout: cardDefinition.layout,
      data: {
        getData: cardDefinition.getData,
      },
      behavior: behaviorResult.getValue(),
    });
  }

  private static convertCardBehavior(
    behavior?: CardBehaviorConfig
  ): Result<CardBehaviorVO> {
    if (!behavior) {
      return Result.ok(CardBehaviorVO.default());
    }

    return CardBehaviorVO.create({
      useDefaultSkeleton: behavior.useDefaultSkeleton,
      useDefaultError: behavior.useDefaultError,
    });
  }
}
