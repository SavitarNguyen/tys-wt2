import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import {
  Error as ErrorIcon,
  TipsAndUpdates,
  School,
} from "@mui/icons-material";
import { ParagraphAnalysis } from "@/lib/types/ielts";

interface ParagraphFeedbackPanelProps {
  paragraph: ParagraphAnalysis;
}

export function ParagraphFeedbackPanel({ paragraph }: ParagraphFeedbackPanelProps) {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Band Score */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        {paragraph.overallParagraphBand && (
          <Chip
            label={paragraph.overallParagraphBand.match(/Band\s+[\d.]+/i)?.[0] || paragraph.overallParagraphBand}
            size="medium"
            color="primary"
            variant="filled"
          />
        )}
      </Stack>

      {/* Issues Section (Red Boxes) */}
      {paragraph.issues && paragraph.issues.length > 0 && (
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <ErrorIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Issues Identified
            </Typography>
          </Stack>

          {paragraph.issues.map((issue, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: "4px solid #dc3545",
                bgcolor: "#fff5f5",
              }}
            >
              <Stack spacing={1.5}>
                {/* Issue Type with Criterion Badge */}
                <Box>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip
                      label={issue.criterion}
                      size="small"
                      color="error"
                    />
                    <Chip
                      label={issue.type}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="subtitle2" fontWeight="bold" color="error.dark">
                    {issue.issue}
                  </Typography>
                </Box>

                {/* Quote (if provided) */}
                {issue.quote && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      From your paragraph:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        fontStyle: "italic",
                        bgcolor: "white",
                        p: 1,
                        borderRadius: 1,
                        borderLeft: "2px solid #dc3545",
                      }}
                    >
                      "{issue.quote}"
                    </Typography>
                  </Box>
                )}

                {/* Explanation */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Why this is problematic:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {issue.explanation}
                  </Typography>
                </Box>

                {/* How to Revise */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    How to revise:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {issue.howToRevise}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      {/* Improvements Section (Yellow Boxes) */}
      {paragraph.improvements && paragraph.improvements.length > 0 && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <TipsAndUpdates sx={{ color: "#ff9800" }} />
            <Typography variant="h6" fontWeight="bold">
              Idea Upgrades
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>
            These ideas aren't wrong, but you can develop them further to achieve a higher band score:
          </Typography>

          {paragraph.improvements.map((improvement, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: "4px solid #ff9800",
                bgcolor: "#fff8e1",
              }}
            >
              <Stack spacing={1.5}>
                {/* Type */}
                <Box>
                  <Chip
                    label={improvement.type}
                    size="small"
                    color="warning"
                    sx={{ mb: 1 }}
                  />
                </Box>

                {/* Current vs Suggestion */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    What you currently have:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      bgcolor: "white",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    {improvement.current}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    How to make it stronger:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {improvement.suggestion}
                  </Typography>
                </Box>

                {/* Explanation */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Why this helps:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {improvement.explanation}
                  </Typography>
                </Box>

                {/* Band Impact */}
                <Box sx={{ bgcolor: "white", p: 1, borderRadius: 1 }}>
                  <Typography variant="caption" color="warning.dark" fontWeight="bold">
                    Band Impact: {improvement.bandImpact}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      {/* No Issues */}
      {(!paragraph.issues || paragraph.issues.length === 0) &&
       (!paragraph.improvements || paragraph.improvements.length === 0) && (
        <Paper sx={{ p: 3, bgcolor: "#f1f8f4", border: "1px solid #a5d6a7", textAlign: "center" }}>
          <School sx={{ fontSize: 48, color: "#4caf50", mb: 1 }} />
          <Typography variant="h6" color="success.dark" gutterBottom>
            Excellent Paragraph!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This paragraph is well-developed with strong ideas and good coherence.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
