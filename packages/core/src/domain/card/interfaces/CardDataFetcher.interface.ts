import { RefreshPolicy } from '../value-objects/RefreshPolicy.vo';

export interface CardDataFetcher<TData> {
  getData: () => Promise<TData> | TData;
  refresh: RefreshPolicy;
}
