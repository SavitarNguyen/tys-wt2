import { Box, Tooltip } from "@mui/material";
import { IELTSError, ErrorSeverity } from "@/lib/types/ielts";
import { useState } from "react";

interface ErrorHighlightProps {
  error: IELTSError;
  onClick: () => void;
  isReviewed: boolean;
}

const severityColors: Record<ErrorSeverity, { bg: string; border: string; hover: string }> = {
  critical: {
    bg: "#ffebee",
    border: "#ef5350",
    hover: "#ffcdd2",
  },
  important: {
    bg: "#fff3e0",
    border: "#ffa726",
    hover: "#ffe0b2",
  },
  minor: {
    bg: "#e8f5e9",
    border: "#66bb6a",
    hover: "#c8e6c9",
  },
};

export function ErrorHighlight({ error, onClick, isReviewed }: ErrorHighlightProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = severityColors[error.severity];

  return (
    <Tooltip
      title={`${error.severity.toUpperCase()} - Click to learn more`}
      arrow
      placement="top"
    >
      <Box
        component="span"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          backgroundColor: isReviewed ? "#f5f5f5" : (isHovered ? colors.hover : colors.bg),
          borderBottom: `2px solid ${colors.border}`,
          cursor: "pointer",
          padding: "2px 0",
          transition: "all 0.2s ease",
          textDecoration: isReviewed ? "none" : "none",
          opacity: isReviewed ? 0.6 : 1,
          position: "relative",
          "&::after": isReviewed ? {
            content: '"✓"',
            position: "absolute",
            right: -2,
            top: -8,
            fontSize: "10px",
            color: colors.border,
          } : {},
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: `0 2px 8px ${colors.border}40`,
          },
        }}
      >
        {error.originalText}
      </Box>
    </Tooltip>
  );
}
