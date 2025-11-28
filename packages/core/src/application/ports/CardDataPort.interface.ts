import type { Result } from '@aob/shared';
import type { CardId } from '../../domain/card/value-objects/CardId.vo';

/**
 * * Port for fetching card data
 *
 * This abstracts how card data is retrieved, allowing different
 * implementations for different environments (browser via HTTP,
 * server via direct call, etc.).
 *
 * Following the Ports & Adapters pattern, this interface defines
 * the contract that must be implemented by infrastructure adapters.
 */
export interface CardDataPort {
  /**
   * Fetches data for a specific card by its ID
   *
   * @param cardId - The unique identifier of the card
   * @returns Promise resolving to a Result containing the data or an error
   *
   * @example
   * ```typescript
   * const result = await dataPort.fetchData(cardId);
   * if (result.isSuccess) {
   *   const data = result.getValue();
   * } else {
   *   const error = result.getError();
   * }
   * ```
   */
  fetchData(cardId: CardId): Promise<Result<unknown>>;
}

