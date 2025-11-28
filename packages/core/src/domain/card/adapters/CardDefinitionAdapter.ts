import { Result } from '@aob/shared';
import type { CardDefinition, RefreshPolicyConfig, CardBehaviorConfig } from '../interfaces/CardDefinition.interface';
import { CardModel } from '../entities/CardModel.entity';
import { RefreshPolicy as RefreshPolicyVO } from '../value-objects/RefreshPolicy.vo';
import { CardBehavior as CardBehaviorVO } from '../value-objects/CardBehavior.vo';

export class CardDefinitionAdapter {
  public static toCardModel<TData>(cardDefinition: CardDefinition<TData>): Result<CardModel<TData>> {
    const refreshPolicyResult = this.convertRefreshPolicy(cardDefinition.refresh);
    if (refreshPolicyResult.isFailure) {
      return Result.fail(refreshPolicyResult.getError());
    }

    const behaviorResult = this.convertCardBehavior(cardDefinition.behavior);
    if (behaviorResult.isFailure) {
      return Result.fail(behaviorResult.getError());
    }

    const cardDataFetcher = {
      getData: cardDefinition.getData,
      refresh: refreshPolicyResult.getValue(),
    };

    return CardModel.create<TData>({
      id: cardDefinition.id,
      title: cardDefinition.title,
      layout: cardDefinition.layout,
      data: cardDataFetcher,
      behavior: behaviorResult.getValue(),
    });
  }

  private static convertRefreshPolicy(
    refreshPolicy?: RefreshPolicyConfig
  ): Result<RefreshPolicyVO> {
    if (!refreshPolicy) {
      return Result.ok(RefreshPolicyVO.default());
    }

    return RefreshPolicyVO.create({
      intervalMs: refreshPolicy.intervalMs,
      enableGlobalRefresh: refreshPolicy.enableGlobalRefresh,
      skipInitialFetch: refreshPolicy.skipInitialFetch,
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

