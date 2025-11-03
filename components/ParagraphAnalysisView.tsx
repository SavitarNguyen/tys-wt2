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
  Divider,
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
  selectedParagraphNumber?: number | null;
}

export function ParagraphAnalysisView({
  paragraphs,
  overallTA,
  overallCC,
  selectedParagraphNumber,
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
        <Accordion
          key={para.paragraphNumber}
          defaultExpanded={selectedParagraphNumber ? para.paragraphNumber === selectedParagraphNumber : para.paragraphNumber <= 2}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Paragraph {para.paragraphNumber}
              </Typography>
              {para.overallParagraphBand && (
                <Chip
                  label={para.overallParagraphBand.match(/Band\s+[\d.]+/i)?.[0] || para.overallParagraphBand}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {/* Comparative Feedback & Band Impacts - Always Visible */}
              {(para.comparativeFeedback || para.taskAchievement.bandImpact || para.coherenceCohesion.bandImpact) && (
                <Paper sx={{ p: 2, bgcolor: "#f3e5f5", border: "1px solid #ba68c8" }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Comparative Feedback & Band Impacts
                  </Typography>
                  <Stack spacing={1.5}>
                    {para.comparativeFeedback && (
                      <Typography variant="body2">{para.comparativeFeedback}</Typography>
                    )}
                    {para.taskAchievement.bandImpact && (
                      <Box>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                          TR Band Impact:
                        </Typography>
                        <Typography variant="body2">{para.taskAchievement.bandImpact}</Typography>
                      </Box>
                    )}
                    {para.coherenceCohesion.bandImpact && (
                      <Box>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                          CC Band Impact:
                        </Typography>
                        <Typography variant="body2">{para.coherenceCohesion.bandImpact}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Nested Accordion: Task Achievement */}
              <Accordion defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip label="TR" color="primary" size="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Task Achievement Analysis
                    </Typography>
                    {para.taskAchievement.bandImpact && (
                      <Chip
                        label={para.taskAchievement.bandImpact.match(/Band\s+[\d.]+/i)?.[0] || para.taskAchievement.bandImpact}
                        size="small"
                        sx={{ bgcolor: "#fff3e0", color: "#e65100" }}
                      />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Main Idea:
                    </Typography>
                    <Typography variant="body2">{para.taskAchievement.mainIdea}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Idea Development:
                    </Typography>
                    <Typography variant="body2">{para.taskAchievement.ideaDevelopment}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Relevance to Prompt:
                    </Typography>
                    <Typography variant="body2">{para.taskAchievement.relevanceToPrompt}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Specificity:
                    </Typography>
                    <Typography variant="body2">{para.taskAchievement.specificity}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Supporting Evidence:
                    </Typography>
                    <Typography variant="body2">{para.taskAchievement.supportingEvidence}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Depth Analysis:
                    </Typography>
                    <Typography variant="body2">{para.taskAchievement.depthAnalysis}</Typography>
                  </Paper>

                  {para.taskAchievement.strengths.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="success.main">
                        Strengths:
                      </Typography>
                      <List dense>
                        {para.taskAchievement.strengths.map((strength, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={strength}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {para.taskAchievement.weaknesses.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="error.main">
                        Weaknesses:
                      </Typography>
                      <List dense>
                        {para.taskAchievement.weaknesses.map((weakness, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Warning sx={{ fontSize: 16, color: "error.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={weakness}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {para.taskAchievement.improvementSteps.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="primary.main">
                        Improvement Steps:
                      </Typography>
                      <List dense>
                        {para.taskAchievement.improvementSteps.map((step, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Lightbulb sx={{ fontSize: 16, color: "warning.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={step}
                              primaryTypographyProps={{ variant: "body2", whiteSpace: "pre-wrap" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Nested Accordion: Coherence & Cohesion */}
              <Accordion defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip label="CC" color="primary" size="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Coherence & Cohesion Analysis
                    </Typography>
                    {para.coherenceCohesion.bandImpact && (
                      <Chip
                        label={para.coherenceCohesion.bandImpact.match(/Band\s+[\d.]+/i)?.[0] || para.coherenceCohesion.bandImpact}
                        size="small"
                        sx={{ bgcolor: "#e3f2fd", color: "#0277bd" }}
                      />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Topic Sentence Analysis:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.topicSentenceAnalysis}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Idea Progression:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.ideaProgression}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Cohesive Devices:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.cohesiveDevices}</Typography>
                  </Paper>

                  {para.coherenceCohesion.cohesionIssues.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="error.main">
                        Cohesion Issues:
                      </Typography>
                      <List dense>
                        {para.coherenceCohesion.cohesionIssues.map((issue, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Warning sx={{ fontSize: 16, color: "error.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={issue}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Paragraph Unity:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.paragraphUnity}</Typography>
                  </Paper>

                  <Paper sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Transition Quality:
                    </Typography>
                    <Typography variant="body2">{para.coherenceCohesion.transitionQuality}</Typography>
                  </Paper>

                  {para.coherenceCohesion.strengths.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="success.main">
                        Strengths:
                      </Typography>
                      <List dense>
                        {para.coherenceCohesion.strengths.map((strength, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={strength}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {para.coherenceCohesion.weaknesses.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="error.main">
                        Weaknesses:
                      </Typography>
                      <List dense>
                        {para.coherenceCohesion.weaknesses.map((weakness, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Warning sx={{ fontSize: 16, color: "error.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={weakness}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {para.coherenceCohesion.improvementSteps.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="primary.main">
                        Improvement Steps:
                      </Typography>
                      <List dense>
                        {para.coherenceCohesion.improvementSteps.map((step, idx) => (
                          <ListItem key={idx} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Lightbulb sx={{ fontSize: 16, color: "warning.main" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={step}
                              primaryTypographyProps={{ variant: "body2", whiteSpace: "pre-wrap" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
