import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  Error as ErrorIcon,
  TipsAndUpdates,
  AutoFixHigh,
  School,
} from "@mui/icons-material";
import { SentenceFeedback } from "@/lib/types/ielts";

interface SentenceFeedbackPanelProps {
  sentence: SentenceFeedback;
}

export function SentenceFeedbackPanel({ sentence }: SentenceFeedbackPanelProps) {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {sentence.criteria.map((criterion) => (
          <Chip
            key={criterion}
            label={criterion}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>

      {/* Corrected Sentence */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "#f0f9ff", border: "1px solid #bae6fd" }}>
        <Typography variant="caption" color="primary" fontWeight="bold" gutterBottom>
          ✓ Corrected Version:
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>
          {sentence.correctedSentence}
        </Typography>
      </Paper>

      {/* Errors Section */}
      {sentence.errors.length > 0 && (
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <ErrorIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Errors Identified
            </Typography>
          </Stack>

          {sentence.errors.map((error, index) => (
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
                {/* Error Type */}
                <Box>
                  <Chip
                    label={error.type}
                    size="small"
                    color="error"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="subtitle2" fontWeight="bold" color="error.dark">
                    {error.issue}
                  </Typography>
                </Box>

                {/* Explanation */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Why this is wrong:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {error.explanation}
                  </Typography>
                </Box>

                {/* How to Revise */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    How to revise:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {error.howToRevise}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      {/* Vocabulary Suggestions */}
      {sentence.vocabSuggestions.length > 0 && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <TipsAndUpdates sx={{ color: "#ff9800" }} />
            <Typography variant="h6" fontWeight="bold">
              Vocabulary Upgrades
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Even when words are correct, you can use better alternatives to improve your band score:
          </Typography>

          {sentence.vocabSuggestions.map((vocab, index) => (
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
                {/* Original vs Suggestion */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                    <Chip
                      label={vocab.original}
                      size="small"
                      sx={{ bgcolor: "white" }}
                    />
                    <Typography variant="body2">→</Typography>
                    <Chip
                      label={vocab.suggestion}
                      size="small"
                      color="warning"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Stack>
                </Box>

                {/* Explanation */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Why it's better:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {vocab.explanation}
                  </Typography>
                </Box>

                {/* Example */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Example:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      fontStyle: "italic",
                      bgcolor: "white",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    "{vocab.example}"
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      {/* No Issues */}
      {sentence.errors.length === 0 && sentence.vocabSuggestions.length === 0 && (
        <Paper sx={{ p: 3, bgcolor: "#f1f8f4", border: "1px solid #a5d6a7", textAlign: "center" }}>
          <School sx={{ fontSize: 48, color: "#4caf50", mb: 1 }} />
          <Typography variant="h6" color="success.dark" gutterBottom>
            Excellent Sentence!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This sentence is well-written with no issues detected.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
