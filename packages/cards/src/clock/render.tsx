import type { CardRenderProps } from "@aob/core";
import type { ClockData } from "./types";

export const ClockRender = ({
  data,
  theme,
}: CardRenderProps<ClockData>) => {
  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        padding: "16px",
        background: theme.palette.surface,
        color: theme.palette.text,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${theme.palette.border}`,
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "16px",
          fontSize: "0.75rem",
          color: theme.palette.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {data.timezone}
      </div>

      <div
        style={{
          fontSize: "2.5rem",
          fontWeight: "300",
          fontFamily: "monospace",
        }}
      >
        {data.time}
      </div>

      <div
        style={{
          marginTop: "8px",
          color: theme.palette.accent,
          fontWeight: 500,
        }}
      >
        {data.date}
      </div>
    </div>
  );
};

