import type {
  CardRenderProps,
  CardSkeletonProps,
  CardErrorProps,
} from "@aob/core";
import type { PriceData } from "./types";

export const BtcPriceSkeleton = ({ theme }: CardSkeletonProps) => (
  <div
    style={{
      padding: "16px",
      background: theme.palette.surfaceAlt,
      color: theme.palette.text,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: `1px solid ${theme.palette.border}`,
      borderRadius: "12px",
    }}
  >
    <div
      style={{
        height: "20px",
        width: "60%",
        background: theme.palette.border,
        marginBottom: "16px",
        borderRadius: "4px",
      }}
    />
    <div
      style={{
        height: "40px",
        width: "80%",
        background: theme.palette.border,
        borderRadius: "4px",
      }}
    />
  </div>
);

export const BtcPriceError = ({
  theme,
  actions,
}: CardErrorProps) => (
  <div
    style={{
      padding: "16px",
      background: theme.palette.surface,
      color: theme.palette.danger,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      border: `1px solid ${theme.palette.danger}`,
      borderRadius: "12px",
    }}
  >
    <h3 style={{ margin: 0, marginBottom: "8px" }}>Error</h3>
    <p style={{ fontSize: "0.875rem", marginBottom: "16px" }}>
      Failed to load BTC price
    </p>
    <button
      onClick={actions.requestRefresh}
      style={{
        padding: "8px 12px",
        background: theme.palette.surfaceAlt,
        color: theme.palette.text,
        border: `1px solid ${theme.palette.border}`,
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Retry
    </button>
  </div>
);

export const BtcPriceRender = ({
  data,
  isLoading,
  theme,
  cardMeta,
  actions,
}: CardRenderProps<PriceData>) => {
  if (!data) {
    return null;
  }

  const isPositive = data.change24h >= 0;
  const changeColor = isPositive
    ? theme.palette.success
    : theme.palette.danger;

  return (
    <div
      style={{
        padding: "16px",
        background: theme.palette.surface,
        color: theme.palette.text,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${theme.palette.border}`,
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.textMuted,
          }}
        >
          {cardMeta.title}
        </h3>
        <button
          onClick={actions.requestRefresh}
          title="Refresh"
          style={{
            background: "transparent",
            border: "none",
            color: theme.palette.textMuted,
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: 0,
            lineHeight: 1,
          }}
        >
          {isLoading ? "..." : "↻"}
        </button>
      </div>

      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          margin: "8px 0",
        }}
      >
        ${data.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>

      <div
        style={{
          color: changeColor,
          fontWeight: "600",
          fontSize: "0.875rem",
        }}
      >
        {isPositive ? "▲" : "▼"} {Math.abs(data.change24h).toFixed(2)}%
      </div>

      <div
        style={{
          fontSize: "0.75rem",
          color: theme.palette.textMuted,
          marginTop: "auto",
          paddingTop: "8px",
        }}
      >
        {data.symbol}
      </div>
    </div>
  );
};

