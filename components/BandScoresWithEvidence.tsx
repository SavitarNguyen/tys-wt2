import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormatQuote } from "@mui/icons-material";
import { IELTSBandScore } from "@/lib/types/ielts";

interface BandScoresWithEvidenceProps {
  overallBand: number;
  bandScores: IELTSBandScore[];
  topic: string;
}

const criterionInfo: Record<string, { name: string; color: string }> = {
  TR: { name: "Task Response", color: "#2196f3" },
  CC: { name: "Coherence & Cohesion", color: "#4caf50" },
  LR: { name: "Lexical Resource", color: "#ff9800" },
  GRA: { name: "Grammatical Range & Accuracy", color: "#9c27b0" },
};

export function BandScoresWithEvidence({
  overallBand,
  bandScores,
  topic,
}: BandScoresWithEvidenceProps) {
  const getBandColor = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 7) return "info";
    if (score >= 6) return "warning";
    return "error";
  };

  return (
    <Box>
      {/* Overall Score */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {overallBand}
        </Typography>
        <Typography variant="h6">Overall Band Score</Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Topic: {topic}
        </Typography>
      </Paper>

      {/* Criterion Scores */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Criterion Breakdown
      </Typography>

      <Stack spacing={3}>
        {bandScores.map((score) => {
          const info = criterionInfo[score.criterion] || { name: "Unknown", color: "#757575" };
          return (
            <Card key={score.criterion} variant="outlined">
              <CardContent>
                {/* Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" sx={{ color: info.color }}>
                      {score.criterion} - {info.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Band ${score.score}`}
                    color={getBandColor(score.score) as any}
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      height: 36,
                      minWidth: 80,
                    }}
                  />
                </Stack>

                {/* Feedback */}
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5", mb: 2 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                    {score.feedback}
                  </Typography>
                </Paper>

                {/* Evidence from Essay */}
                {score.evidence.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.secondary"
                      gutterBottom
                    >
                      Evidence from your essay:
                    </Typography>
                    <List dense>
                      {score.evidence.map((evidence, idx) => (
                        <ListItem
                          key={idx}
                          sx={{
                            bgcolor: "#fff8e1",
                            borderLeft: `3px solid ${info.color}`,
                            mb: 1,
                            borderRadius: 1,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <FormatQuote sx={{ color: info.color }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={evidence}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontStyle: "italic",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
