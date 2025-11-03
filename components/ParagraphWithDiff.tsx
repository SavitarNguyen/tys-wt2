import { Box, Typography, Paper, Stack, Chip } from "@mui/material";
import { ParagraphAnalysis, SentenceFeedback } from "@/lib/types/ielts";

interface ParagraphWithDiffProps {
  paragraph: ParagraphAnalysis;
  sentences: SentenceFeedback[];
  isSelected: boolean;
  onClick: () => void;
}

// Simple sentence-level diff function
function getSentenceLevelDiff(original: string, revised: string) {
  // If they're the same, no diff needed
  if (original === revised) {
    const splitSentences = (text: string) => {
      return text
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    };
    const sentences = splitSentences(original);
    return {
      originalMarked: sentences.map(s => ({ text: s, status: 'kept' as 'kept' })),
      revisedMarked: sentences.map(s => ({ text: s, status: 'kept' as 'kept' }))
    };
  }

  // Split into sentences - simple approach using period, question mark, exclamation mark
  const splitSentences = (text: string) => {
    return text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const originalSentences = splitSentences(original);
  const revisedSentences = splitSentences(revised);

  // Find sentences that appear in both (approximately - using substring matching)
  const commonSentences = new Set<string>();
  const matchedRevised = new Set<number>();

  originalSentences.forEach(origSent => {
    revisedSentences.forEach((revSent, revIdx) => {
      if (matchedRevised.has(revIdx)) return;

      // Check for exact match first
      if (origSent === revSent) {
        commonSentences.add(origSent);
        commonSentences.add(revSent);
        matchedRevised.add(revIdx);
        return;
      }

      // Then check for high similarity (lowered threshold to 60%)
      const origWords = origSent.toLowerCase().split(/\s+/);
      const revWords = revSent.toLowerCase().split(/\s+/);
      const commonWords = origWords.filter(w => revWords.includes(w));
      const similarity = commonWords.length / Math.max(origWords.length, revWords.length);

      if (similarity > 0.6) {
        commonSentences.add(origSent);
        commonSentences.add(revSent);
        matchedRevised.add(revIdx);
      }
    });
  });

  // Mark sentences as removed (red), kept, or added (green)
  const originalMarked = originalSentences.map(sent => ({
    text: sent,
    status: commonSentences.has(sent) ? 'kept' : 'removed' as 'kept' | 'removed'
  }));

  const revisedMarked = revisedSentences.map(sent => ({
    text: sent,
    status: commonSentences.has(sent) ? 'kept' : 'added' as 'kept' | 'added'
  }));

  return { originalMarked, revisedMarked };
}

export function ParagraphWithDiff({
  paragraph,
  sentences,
  isSelected,
  onClick,
}: ParagraphWithDiffProps) {
  // Get idea-level diff between original and revised paragraph
  const { originalMarked, revisedMarked } = getSentenceLevelDiff(
    paragraph.text,
    paragraph.revisedParagraph || paragraph.text
  );

  return (
    <Box
      onClick={onClick}
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateX(4px)",
        },
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Typography variant="subtitle2" fontWeight="bold">
          Paragraph {paragraph.paragraphNumber}
        </Typography>
        {paragraph.overallParagraphBand && (
          <Chip
            label={paragraph.overallParagraphBand.match(/Band\s+[\d.]+/i)?.[0] || paragraph.overallParagraphBand}
            size="small"
            color={isSelected ? "primary" : "default"}
            variant={isSelected ? "filled" : "outlined"}
          />
        )}
      </Stack>

      {/* Original Text with RED highlights for weak ideas */}
      <Paper
        sx={{
          p: 2,
          bgcolor: isSelected ? "#f5f5f5" : "#fafafa",
          border: isSelected ? "2px solid" : "1px solid",
          borderColor: isSelected ? "primary.main" : "divider",
          mb: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight="bold" gutterBottom>
          Original
        </Typography>
        <Box sx={{ lineHeight: 1.8 }}>
          {originalMarked.map((item, idx) => (
            <Typography
              key={idx}
              component="span"
              variant="body2"
              sx={{
                ...(item.status === 'removed' && {
                  backgroundColor: "#ffebee",
                  color: "#d32f2f",
                  textDecoration: "line-through",
                  padding: "2px 4px",
                  borderRadius: "2px",
                }),
              }}
            >
              {item.text}{idx < originalMarked.length - 1 ? " " : ""}
            </Typography>
          ))}
        </Box>
      </Paper>

      {/* Revised Text with GREEN highlights for improvements */}
      <Paper
        sx={{
          p: 2,
          bgcolor: "#ffffff",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight="bold" gutterBottom>
          Revised (Idea-Level Improvements)
        </Typography>
        <Box sx={{ lineHeight: 1.8 }}>
          {revisedMarked.map((item, idx) => (
            <Typography
              key={idx}
              component="span"
              variant="body2"
              sx={{
                ...(item.status === 'added' && {
                  backgroundColor: "#fff8e1",
                  color: "#f57c00",
                  fontWeight: 500,
                  padding: "2px 4px",
                  borderRadius: "2px",
                }),
              }}
            >
              {item.text}{idx < revisedMarked.length - 1 ? " " : ""}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
