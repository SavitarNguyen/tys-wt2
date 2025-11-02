import { Box, Typography } from "@mui/material";
import { IELTSError } from "@/lib/types/ielts";
import { ErrorHighlight } from "./ErrorHighlight";
import { useMemo } from "react";

interface InteractiveEssayProps {
  originalText: string;
  errors: IELTSError[];
  reviewedErrors: Set<string>;
  onErrorClick: (error: IELTSError) => void;
}

interface TextSegment {
  text: string;
  error?: IELTSError;
}

export function InteractiveEssay({
  originalText,
  errors,
  reviewedErrors,
  onErrorClick,
}: InteractiveEssayProps) {
  const segments = useMemo(() => {
    const sortedErrors = [...errors].sort((a, b) => a.position.start - b.position.start);
    const result: TextSegment[] = [];
    let currentPos = 0;

    for (const error of sortedErrors) {
      // Add text before the error
      if (currentPos < error.position.start) {
        result.push({
          text: originalText.slice(currentPos, error.position.start),
        });
      }

      // Add the error segment
      result.push({
        text: error.originalText,
        error,
      });

      currentPos = error.position.end;
    }

    // Add remaining text
    if (currentPos < originalText.length) {
      result.push({
        text: originalText.slice(currentPos),
      });
    }

    return result;
  }, [originalText, errors]);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "white",
        borderRadius: 2,
        lineHeight: 1.8,
        fontSize: "16px",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 2, color: "text.secondary" }}>
        Your Essay (Click on highlighted errors to learn)
      </Typography>
      <Box sx={{ whiteSpace: "pre-wrap", fontSize: "inherit" }}>
        {segments.map((segment, index) => {
          if (segment.error) {
            return (
              <ErrorHighlight
                key={`error-${index}`}
                error={segment.error}
                onClick={() => onErrorClick(segment.error!)}
                isReviewed={reviewedErrors.has(segment.error.id)}
              />
            );
          }
          return <span key={`text-${index}`}>{segment.text}</span>;
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #eee" }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: "bold" }}>
          Error Severity:
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 12,
                bgcolor: "#ffebee",
                border: "2px solid #ef5350",
              }}
            />
            <Typography variant="caption">Critical (GRA)</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 12,
                bgcolor: "#fff3e0",
                border: "2px solid #ffa726",
              }}
            />
            <Typography variant="caption">Important (TR/CC/LR)</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 12,
                bgcolor: "#e8f5e9",
                border: "2px solid #66bb6a",
              }}
            />
            <Typography variant="caption">Minor (Style)</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
