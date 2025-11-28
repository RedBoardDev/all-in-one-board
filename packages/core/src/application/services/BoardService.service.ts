import { Result } from '@aob/shared';
import type { CardId } from '../../domain/card/value-objects/CardId.vo';
import type { CardModel } from '../../domain/card/entities/CardModel.entity';
import type { CardDefinition } from '../../domain/card/interfaces/CardDefinition.interface';
import { CardState } from '../../domain/card/entities/CardState.entity';

export class BoardService {
  private readonly cardStates: Map<string, CardState> = new Map();
  private readonly cardModels: Map<string, CardModel<any>> = new Map();
  private readonly cardDefinitions: Map<string, CardDefinition<any>> = new Map();

  public registerCardDefinition<T>(
    cardDefinition: CardDefinition<T>,
    cardModel: CardModel<T>
  ): Result<void> {
    const cardIdValue = cardDefinition.id.toValue();

    if (this.cardModels.has(cardIdValue)) {
      return Result.fail(`Card with id ${cardIdValue} already registered`);
    }

    this.cardDefinitions.set(cardIdValue, cardDefinition);
    this.cardModels.set(cardIdValue, cardModel);

    const stateResult = CardState.create(cardModel.cardId);
    if (stateResult.isFailure) {
      return Result.fail(stateResult.getError());
    }

    this.cardStates.set(cardIdValue, stateResult.getValue());
    return Result.ok();
  }

  public registerCard<T>(cardModel: CardModel<T>): Result<void> {
    const cardIdValue = cardModel.cardId.toValue();

    if (this.cardModels.has(cardIdValue)) {
      return Result.fail(`Card with id ${cardIdValue} already registered`);
    }

    this.cardModels.set(cardIdValue, cardModel);

    const stateResult = CardState.create(cardModel.cardId);
    if (stateResult.isFailure) {
      return Result.fail(stateResult.getError());
    }

    this.cardStates.set(cardIdValue, stateResult.getValue());
    return Result.ok();
  }

  public unregisterCard(cardId: CardId): Result<void> {
    const cardIdValue = cardId.toValue();

    if (!this.cardModels.has(cardIdValue)) {
      return Result.fail(`Card with id ${cardIdValue} not found`);
    }

    this.cardDefinitions.delete(cardIdValue);
    this.cardModels.delete(cardIdValue);
    this.cardStates.delete(cardIdValue);
    return Result.ok();
  }

  public getCardModel(cardId: CardId): CardModel<any> | undefined {
    return this.cardModels.get(cardId.toValue());
  }

  public getCardState(cardId: CardId): CardState | undefined {
    return this.cardStates.get(cardId.toValue());
  }

  public getAllCardModels(): CardModel<any>[] {
    return Array.from(this.cardModels.values());
  }

  public getAllCardDefinitions(): CardDefinition<any>[] {
    return Array.from(this.cardDefinitions.values());
  }

  public getAllCardStates(): CardState[] {
    return Array.from(this.cardStates.values());
  }

  public hasCard(cardId: CardId): boolean {
    return this.cardModels.has(cardId.toValue());
  }

  public getCardCount(): number {
    return this.cardModels.size;
  }

  public clear(): void {
    this.cardDefinitions.clear();
    this.cardModels.clear();
    this.cardStates.clear();
  }
}

