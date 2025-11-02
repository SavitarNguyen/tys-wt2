import { Box, Typography } from "@mui/material";
import { SentenceFeedback, WordCorrection } from "@/lib/types/ielts";
import { diffWords, Change } from "diff";

interface SentenceWithCorrectionsProps {
  sentence: SentenceFeedback;
  isSelected: boolean;
  isReviewed: boolean;
  onClick: () => void;
}

export function SentenceWithCorrections({
  sentence,
  isSelected,
  isReviewed,
  onClick,
}: SentenceWithCorrectionsProps) {
  const renderSentenceWithCorrections = () => {
    const { originalSentence, correctedSentence, errors } = sentence;

    // If no errors, no corrections needed
    if (errors.length === 0 && originalSentence === correctedSentence) {
      return <span>{originalSentence}</span>;
    }

    // Use word-level diff between original and corrected sentences
    const differences: Change[] = diffWords(originalSentence, correctedSentence);
    const parts: JSX.Element[] = [];

    differences.forEach((part, idx) => {
      if (part.added) {
        // Added text - show in green
        parts.push(
          <Box
            component="span"
            key={`add-${idx}`}
            sx={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "2px 4px",
              marginLeft: 0.5,
              marginRight: 0.5,
              borderRadius: "3px",
              fontWeight: 500,
            }}
          >
            {part.value}
          </Box>
        );
      } else if (part.removed) {
        // Removed text - show with red strikethrough
        parts.push(
          <Box
            component="span"
            key={`remove-${idx}`}
            sx={{
              textDecoration: "line-through",
              textDecorationColor: "#dc3545",
              textDecorationThickness: "2px",
              color: "#dc3545",
              opacity: 0.7,
              marginRight: 0.5,
            }}
          >
            {part.value}
          </Box>
        );
      } else {
        // Unchanged text
        parts.push(<span key={`same-${idx}`}>{part.value}</span>);
      }
    });

    return <>{parts}</>;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        padding: 2,
        marginBottom: 1,
        borderRadius: 1,
        cursor: "pointer",
        backgroundColor: isSelected
          ? "#e3f2fd"
          : isReviewed
          ? "#f5f5f5"
          : "white",
        border: isSelected ? "2px solid #2196f3" : "1px solid #e0e0e0",
        transition: "all 0.2s ease",
        position: "relative",
        "&:hover": {
          backgroundColor: isSelected ? "#e3f2fd" : "#fafafa",
          borderColor: isSelected ? "#2196f3" : "#bdbdbd",
          transform: "translateX(4px)",
        },
      }}
    >
      {isReviewed && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#4caf50",
            fontSize: "18px",
          }}
        >
          ✓
        </Box>
      )}
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.8,
          fontSize: "16px",
          paddingRight: isReviewed ? 4 : 0,
        }}
      >
        {renderSentenceWithCorrections()}
      </Typography>
    </Box>
  );
}
