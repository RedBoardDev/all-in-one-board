import type {
  CardRenderProps,
  CardSkeletonProps,
  CardErrorProps,
} from "@aob/core";
import type { QuoteData } from "./types";

export const QuoteSkeleton = ({ theme }: CardSkeletonProps) => (
  <div
    style={{
      padding: "20px",
      background: theme.palette.surfaceAlt,
      color: theme.palette.text,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      border: `1px solid ${theme.palette.border}`,
      borderRadius: "12px",
    }}
  >
    <div
      style={{
        height: "16px",
        width: "90%",
        background: theme.palette.border,
        marginBottom: "8px",
        borderRadius: "4px",
      }}
    />
    <div
      style={{
        height: "16px",
        width: "70%",
        background: theme.palette.border,
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    />
    <div
      style={{
        height: "12px",
        width: "30%",
        background: theme.palette.border,
        marginLeft: "auto",
        borderRadius: "4px",
      }}
    />
  </div>
);

export const QuoteError = ({ theme, actions }: CardErrorProps) => (
  <div
    style={{
      padding: "20px",
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
    <p style={{ marginBottom: "16px" }}>Could not load quote.</p>
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

export const QuoteRender = ({
  data,
  isLoading,
  theme,
  actions,
}: CardRenderProps<QuoteData>) => {
  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        padding: "20px",
        background: theme.palette.surface,
        color: theme.palette.text,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        border: `1px solid ${theme.palette.border}`,
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "background 0.3s, color 0.3s",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        <button
          onClick={actions.requestRefresh}
          title="New Quote"
          style={{
            background: "transparent",
            border: "none",
            color: theme.palette.textMuted,
            cursor: "pointer",
            fontSize: "1rem",
            opacity: 0.5,
          }}
        >
          {isLoading ? "..." : "↻"}
        </button>
      </div>

      <blockquote style={{ margin: 0, padding: 0 }}>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.6",
            fontStyle: "italic",
            margin: "0 0 16px 0",
            position: "relative",
          }}
        >
          "{data.content}"
        </p>
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            borderTop: `1px solid ${theme.palette.border}`,
            paddingTop: "16px",
          }}
        >
          <cite
            style={{
              fontStyle: "normal",
              fontWeight: 600,
              color: theme.palette.text,
            }}
          >
            — {data.author}
          </cite>
          <span
            style={{
              fontSize: "0.75rem",
              background: theme.palette.accentSoft,
              color: theme.palette.accent,
              padding: "4px 8px",
              borderRadius: "12px",
            }}
          >
            {data.tag}
          </span>
        </footer>
      </blockquote>
    </div>
  );
};

