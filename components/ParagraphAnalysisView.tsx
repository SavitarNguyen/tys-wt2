import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ExpandMore,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Lightbulb,
} from "@mui/icons-material";
import { ParagraphAnalysis } from "@/lib/types/ielts";

interface ParagraphAnalysisViewProps {
  paragraphs: ParagraphAnalysis[];
  overallTA: string;
  overallCC: string;
}

export function ParagraphAnalysisView({
  paragraphs,
  overallTA,
  overallCC,
}: ParagraphAnalysisViewProps) {
  return (
    <Box>
      {/* Overall Assessments */}
      <Stack spacing={2} mb={3}>
        <Paper sx={{ p: 2, bgcolor: "#fff3e0", border: "1px solid #ffb74d" }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip label="TR" color="primary" size="small" />
            Overall Task Achievement
          </Typography>
          <Typography variant="body2">{overallTA}</Typography>
        </Paper>

        <Paper sx={{ p: 2, bgcolor: "#e3f2fd", border: "1px solid #64b5f6" }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip label="CC" color="primary" size="small" />
            Overall Coherence & Cohesion
          </Typography>
          <Typography variant="body2">{overallCC}</Typography>
        </Paper>
      </Stack>

      {/* Paragraph-by-Paragraph Analysis */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
        Paragraph-by-Paragraph Breakdown
      </Typography>

      {paragraphs.map((para) => (
        <Accordion key={para.paragraphNumber} defaultExpanded={para.paragraphNumber <= 2}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Paragraph {para.paragraphNumber}
              {(!para.taskAchievement.addressesPrompt || !para.coherenceCohesion.hasTopicSentence) && (
                <Warning sx={{ ml: 1, color: "warning.main", fontSize: 20 }} />
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {/* Paragraph Text */}
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Typography variant="body2" sx={{ fontStyle: "italic", lineHeight: 1.8 }}>
                  {para.text}
                </Typography>
              </Paper>

              {/* Task Achievement */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {para.taskAchievement.addressesPrompt ? (
                      <CheckCircle sx={{ color: "success.main" }} />
                    ) : (
                      <ErrorIcon sx={{ color: "error.main" }} />
                    )}
                    <span>Task Achievement</span>
                  </Stack>
                </Typography>

                <Alert
                  severity={para.taskAchievement.addressesPrompt ? "success" : "warning"}
                  sx={{ mb: 1 }}
                >
                  {para.taskAchievement.explanation}
                </Alert>

                {para.taskAchievement.suggestions.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      Suggestions:
                    </Typography>
                    <List dense>
                      {para.taskAchievement.suggestions.map((suggestion, idx) => (
                        <ListItem key={idx} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Lightbulb sx={{ fontSize: 16, color: "warning.main" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>

              {/* Coherence & Cohesion */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {para.coherenceCohesion.hasTopicSentence ? (
                      <CheckCircle sx={{ color: "success.main" }} />
                    ) : (
                      <ErrorIcon sx={{ color: "error.main" }} />
                    )}
                    <span>Coherence & Cohesion</span>
                  </Stack>
                </Typography>

                <Stack spacing={1}>
                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Topic Sentence:
                    </Typography>
                    <Typography variant="body2">
                      {para.coherenceCohesion.hasTopicSentence
                        ? "✓ Present"
                        : "✗ Missing - Add a clear topic sentence"}
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Transitions:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.transitions}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Logical Flow:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.logicalFlow}</Typography>
                  </Paper>
                </Stack>

                {para.coherenceCohesion.suggestions.length > 0 && (
                  <Box sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      Suggestions:
                    </Typography>
                    <List dense>
                      {para.coherenceCohesion.suggestions.map((suggestion, idx) => (
                        <ListItem key={idx} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Lightbulb sx={{ fontSize: 16, color: "warning.main" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
