import type { CardDefinition } from "@aob/core";
import { CardId, LayoutConstraints } from "@aob/core";
import type { ClockData } from "./types";
import { getClockData } from "./data";
import { ClockRender } from "./render";

const layout = LayoutConstraints.createOrThrow({
  minW: 1,
  minH: 1,
  defaultW: 1,
  defaultH: 1,
  maxW: 2,
});

const cardId = CardId.createOrThrow("clock");

export const ClockCard: CardDefinition<ClockData> = {
  id: cardId,
  title: "Local Time",
  layout,

  getData: getClockData,
  refresh: {
    intervalMs: 1000,
    enableGlobalRefresh: false,
  },

  render: ClockRender,

  behavior: {
    useDefaultSkeleton: false,
    useDefaultError: true,
  },
};
