export interface CardDataFetcher<TData> {
  getData: () => Promise<TData> | TData;
}
