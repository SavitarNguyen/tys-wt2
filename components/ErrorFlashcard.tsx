import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Error as ErrorIcon,
  Lightbulb,
  AutoStories,
} from "@mui/icons-material";
import { IELTSError, ErrorSeverity } from "@/lib/types/ielts";

interface ErrorFlashcardProps {
  error: IELTSError;
  currentIndex: number;
  totalErrors: number;
  onPrevious: () => void;
  onNext: () => void;
  onMarkReviewed: () => void;
  isReviewed: boolean;
}

const severityConfig: Record<ErrorSeverity, { color: any; label: string; icon: any }> = {
  critical: { color: "error", label: "Critical", icon: <ErrorIcon /> },
  important: { color: "warning", label: "Important", icon: <Lightbulb /> },
  minor: { color: "success", label: "Minor", icon: <CheckCircle /> },
};

export function ErrorFlashcard({
  error,
  currentIndex,
  totalErrors,
  onPrevious,
  onNext,
  onMarkReviewed,
  isReviewed,
}: ErrorFlashcardProps) {
  const config = severityConfig[error.severity];

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            Error {currentIndex + 1} of {totalErrors}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={config.label}
              color={config.color}
              size="small"
              icon={config.icon}
              sx={{ color: "white" }}
            />
            {error.criteria.map((criterion) => (
              <Chip
                key={criterion}
                label={criterion}
                size="small"
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
              />
            ))}
          </Stack>
        </Stack>

        {/* Original Text */}
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.1)" }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Your text:
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: "italic", mt: 1 }}>
            "{error.originalText}"
          </Typography>
        </Paper>

        {/* What's Wrong */}
        <Box mb={2}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <ErrorIcon fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              What's wrong:
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ pl: 4 }}>
            {error.explanation}
          </Typography>
        </Box>

        {/* Why It's Wrong */}
        <Box mb={2}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Lightbulb fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              Why it matters:
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ pl: 4 }}>
            {error.reason}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Correction */}
        <Paper
          elevation={0}
          sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.95)", color: "black" }}
        >
          <Typography variant="caption" color="success.main" fontWeight="bold">
            ✓ Correction:
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
            "{error.correction}"
          </Typography>
        </Paper>

        {/* Example */}
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <AutoStories fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              Example usage:
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ pl: 4, fontStyle: "italic" }}>
            {error.example}
          </Typography>
        </Box>

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton
            onClick={onPrevious}
            disabled={currentIndex === 0}
            sx={{ color: "white" }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
              {isReviewed ? "Reviewed ✓" : "Click next when ready"}
            </Typography>
          </Box>

          <IconButton
            onClick={() => {
              if (!isReviewed) onMarkReviewed();
              onNext();
            }}
            disabled={currentIndex === totalErrors - 1}
            sx={{ color: "white" }}
          >
            <ArrowForward />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
