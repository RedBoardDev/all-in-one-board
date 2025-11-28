import type { CardDefinition } from '@aob/core';
import { BtcPriceCard } from './btc-price';
import { ClockCard } from './clock';
import { QuoteCard } from './quote';

export const allCards: CardDefinition<any>[] = [
  BtcPriceCard,
  ClockCard,
  QuoteCard,
];
