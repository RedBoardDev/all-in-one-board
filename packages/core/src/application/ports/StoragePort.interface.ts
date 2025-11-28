import { Result } from '@aob/shared';

export interface StoragePort {
  getItem(key: string): Promise<Result<string | null>>;
  setItem(key: string, value: string): Promise<Result<void>>;
  removeItem(key: string): Promise<Result<void>>;
  clear(): Promise<Result<void>>;
}
