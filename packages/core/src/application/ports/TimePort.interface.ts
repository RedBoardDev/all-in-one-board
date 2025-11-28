import type { TimerId } from './TimerId.type';

export interface TimePort {
  now(): number;
  setInterval(callback: () => void, ms: number): TimerId;
  clearInterval(id: TimerId): void;
  setTimeout(callback: () => void, ms: number): TimerId;
  clearTimeout(id: TimerId): void;
}
