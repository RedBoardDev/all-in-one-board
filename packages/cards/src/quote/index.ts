import type { CardDefinition } from "@aob/core";
import { CardId, LayoutConstraints } from "@aob/core";
import type { QuoteData } from "./types";
import { getQuoteData } from "./data";
import { QuoteRender, QuoteSkeleton, QuoteError } from "./render";

const layout = LayoutConstraints.createOrThrow({
  minW: 1,
  minH: 1,
  defaultW: 2,
  defaultH: 1,
  maxW: 4,
});

const cardId = CardId.createOrThrow("quote");

export const QuoteCard: CardDefinition<QuoteData> = {
  id: cardId,
  title: "Quote of the Moment",
  layout,

  getData: getQuoteData,
  refresh: {
    intervalMs: 60_000,
    enableGlobalRefresh: true,
  },

  render: QuoteRender,
  renderSkeleton: QuoteSkeleton,
  renderError: QuoteError,

  behavior: {
    useDefaultSkeleton: false,
    useDefaultError: false,
  },
};
