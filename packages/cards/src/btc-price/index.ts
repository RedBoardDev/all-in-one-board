import type { CardDefinition } from "@aob/core";
import { CardId, LayoutConstraints } from "@aob/core";
import type { PriceData } from "./types";
import { getBtcPriceData } from "./data";
import {
  BtcPriceRender,
  BtcPriceSkeleton,
  BtcPriceError,
} from "./render";

const layout = LayoutConstraints.createOrThrow({
  minW: 1,
  minH: 1,
  defaultW: 2,
  defaultH: 1,
  maxW: 4,
});

const cardId = CardId.createOrThrow("btc-price");

export const BtcPriceCard: CardDefinition<PriceData> = {
  id: cardId,
  title: "BTC Price",
  layout,

  getData: getBtcPriceData,
  refresh: {
    intervalMs: 30_000,
    enableGlobalRefresh: true,
  },

  render: BtcPriceRender,
  renderSkeleton: BtcPriceSkeleton,
  renderError: BtcPriceError,

  behavior: {
    useDefaultSkeleton: false,
    useDefaultError: false,
  },
};
