"use client";
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  School,
  ListAlt,
  Assessment,
  Article,
  EmojiEvents,
} from "@mui/icons-material";
import { IELTSFeedback } from "@/lib/types/ielts";
import { InteractiveEssay } from "./InteractiveEssay";
import { ErrorFlashcard } from "./ErrorFlashcard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface InteractiveIELTSFeedbackProps {
  feedback: IELTSFeedback;
  originalText: string;
  fullReport: string;
}

export function InteractiveIELTSFeedback({
  feedback,
  originalText,
  fullReport,
}: InteractiveIELTSFeedbackProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [reviewedErrors, setReviewedErrors] = useState<Set<string>>(new Set());

  const handleErrorClick = (errorId: string) => {
    const index = feedback.errors.findIndex((e) => e.id === errorId);
    if (index !== -1) {
      setCurrentErrorIndex(index);
      setActiveTab(0); // Switch to flashcard tab
    }
  };

  const handleMarkReviewed = () => {
    setReviewedErrors((prev) => new Set(prev).add(feedback.errors[currentErrorIndex].id));
  };

  const progressPercentage = (reviewedErrors.size / feedback.errors.length) * 100;

  return (
    <Box>
      {/* Progress Bar */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.main", color: "white" }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <EmojiEvents />
          <Typography variant="h6">
            Learning Progress: {reviewedErrors.size} / {feedback.errors.length} errors reviewed
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.3)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "success.light",
            },
          }}
        />
        {progressPercentage === 100 && (
          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            🎉 Amazing! You've reviewed all errors. Keep practicing!
          </Typography>
        )}
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              minHeight: 64,
            },
          }}
        >
          <Tab icon={<School />} label="Learn Errors" />
          <Tab icon={<ListAlt />} label="Your Essay" />
          <Tab icon={<Assessment />} label="Band Scores" />
          <Tab icon={<Article />} label="Full Report" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {/* Tab 0: Flashcards */}
        {activeTab === 0 && feedback.errors.length > 0 && (
          <Box>
            <ErrorFlashcard
              error={feedback.errors[currentErrorIndex]}
              currentIndex={currentErrorIndex}
              totalErrors={feedback.errors.length}
              onPrevious={() => setCurrentErrorIndex((prev) => Math.max(0, prev - 1))}
              onNext={() =>
                setCurrentErrorIndex((prev) => Math.min(feedback.errors.length - 1, prev + 1))
              }
              onMarkReviewed={handleMarkReviewed}
              isReviewed={reviewedErrors.has(feedback.errors[currentErrorIndex].id)}
            />
          </Box>
        )}

        {/* Tab 1: Interactive Essay */}
        {activeTab === 1 && (
          <InteractiveEssay
            originalText={originalText}
            errors={feedback.errors}
            reviewedErrors={reviewedErrors}
            onErrorClick={(error) => handleErrorClick(error.id)}
          />
        )}

        {/* Tab 2: Band Scores */}
        {activeTab === 2 && (
          <Box>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Your Band Score: {feedback.overallBand}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Topic: {feedback.topic}
              </Typography>
            </Paper>

            <Grid container spacing={2} mb={3}>
              {feedback.bandScores.map((score) => (
                <Grid item xs={12} md={6} key={score.criterion}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">{score.criterion}</Typography>
                        <Chip
                          label={`Band ${score.score}`}
                          color={score.score >= 7 ? "success" : score.score >= 6 ? "warning" : "error"}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {score.feedback}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Strengths & Improvements */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: "success.light", color: "success.contrastText" }}>
                  <Typography variant="h6" gutterBottom>
                    💪 Your Strengths
                  </Typography>
                  <ul>
                    {feedback.strengths.map((strength, index) => (
                      <li key={index}>
                        <Typography variant="body2">{strength}</Typography>
                      </li>
                    ))}
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: "warning.light" }}>
                  <Typography variant="h6" gutterBottom>
                    📈 Areas to Improve
                  </Typography>
                  <ul>
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index}>
                        <Typography variant="body2">{improvement}</Typography>
                      </li>
                    ))}
                  </ul>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Full Report */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Box className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullReport}</ReactMarkdown>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
