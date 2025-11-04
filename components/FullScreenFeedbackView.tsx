"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Close,
  Assessment,
  Article,
  EmojiEvents,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { IELTSFeedback } from "@/lib/types/ielts";
import { SentenceWithCorrections } from "./SentenceWithCorrections";
import { SentenceFeedbackPanel } from "./SentenceFeedbackPanel";
import { ParagraphAnalysisView } from "./ParagraphAnalysisView";
import { BandScoresWithEvidence } from "./BandScoresWithEvidence";
import { ParagraphWithDiff } from "./ParagraphWithDiff";
import { IELTSFeedbackLoadingSkeleton } from "./IELTSFeedbackLoadingSkeleton";

interface FullScreenFeedbackViewProps {
  feedback: IELTSFeedback | null;
  onClose: () => void;
  onDownload: () => void;
  isLoading?: boolean;
  streamingProgress?: number;
  streamingStatus?: string;
  streamingCharsReceived?: number;
}

export function FullScreenFeedbackView({
  feedback,
  onClose,
  onDownload,
  isLoading = false,
  streamingProgress = 0,
  streamingStatus = "",
  streamingCharsReceived = 0,
}: FullScreenFeedbackViewProps) {
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [reviewedSentences, setReviewedSentences] = useState<Set<string>>(new Set());
  const [rightPanelTab, setRightPanelTab] = useState<number>(0);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);

  // If loading, show skeleton
  if (isLoading || !feedback) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.default",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
            <Typography variant="h6">IELTS Feedback Review</Typography>
          </Stack>
        </Paper>

        {/* Loading Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          <IELTSFeedbackLoadingSkeleton
            progress={streamingProgress}
            statusMessage={streamingStatus}
            charsReceived={streamingCharsReceived}
          />
        </Box>
      </Box>
    );
  }

  const handleSentenceClick = (index: number) => {
    setSelectedSentenceIndex(index);
    setRightPanelTab(0); // Switch to sentence feedback tab

    // Mark as reviewed
    const sentenceId = feedback.sentences[index].id;
    setReviewedSentences((prev) => new Set(prev).add(sentenceId));
  };

  const handleParagraphClick = (index: number) => {
    setSelectedParagraphIndex(index);
    setRightPanelTab(2); // Switch to paragraph analysis tab
  };

  const handleParagraphNumberClick = (paragraphNumber: number) => {
    // Find the index of the paragraph with this number
    const index = feedback.paragraphs.findIndex(p => p.paragraphNumber === paragraphNumber);
    if (index !== -1) {
      setSelectedParagraphIndex(index);
      // Scroll to the paragraph in the left panel if needed
      // The left panel will update because selectedParagraphIndex changed
    }
  };

  const progressPercentage = (reviewedSentences.size / feedback.sentences.length) * 100;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flex={1}>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
          <Typography variant="h6">IELTS Feedback Review</Typography>

          {/* Progress */}
          <Box sx={{ flex: 1, maxWidth: 400, ml: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <EmojiEvents sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography variant="body2">
                Progress: {reviewedSentences.size} / {feedback.sentences.length} sentences
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        </Stack>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
          size="small"
        >
          Download Report
        </Button>
      </Paper>

      {/* Main Content - Split View */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel - Essay with Corrections */}
        <Box
          sx={{
            width: "50%",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" gutterBottom>
              {rightPanelTab === 2 ? "Paragraphs" : rightPanelTab === 1 ? "Your Essay" : "Your Essay"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rightPanelTab === 2
                ? "Click any paragraph to see detailed analysis →"
                : rightPanelTab === 1
                ? "Original essay for reference"
                : "Click any sentence to see detailed feedback →"}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            {/* Tab 0: Sentence Feedback - Show sentences with corrections */}
            {rightPanelTab === 0 && feedback.sentences.map((sentence, index) => (
              <SentenceWithCorrections
                key={sentence.id}
                sentence={sentence}
                isSelected={selectedSentenceIndex === index}
                isReviewed={reviewedSentences.has(sentence.id)}
                onClick={() => handleSentenceClick(index)}
              />
            ))}

            {/* Tab 1: Band Scores - Show original essay */}
            {rightPanelTab === 1 && (
              <Box>
                <Typography variant="body1" sx={{ lineHeight: 2, whiteSpace: "pre-wrap" }}>
                  {feedback.sentences.map(s => s.originalSentence).join(" ")}
                </Typography>
              </Box>
            )}

            {/* Tab 2: Paragraph Analysis - Show paragraphs with diff */}
            {rightPanelTab === 2 && feedback.paragraphs.map((paragraph, index) => (
              <ParagraphWithDiff
                key={paragraph.paragraphNumber}
                paragraph={paragraph}
                sentences={feedback.sentences}
                isSelected={selectedParagraphIndex === index}
                onClick={() => handleParagraphClick(index)}
              />
            ))}
          </Box>
        </Box>

        {/* Right Panel - Feedback */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          {/* Tabs */}
          <Paper square elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={rightPanelTab}
              onChange={(_, newValue) => setRightPanelTab(newValue)}
              variant="fullWidth"
            >
              <Tab
                label="Sentence Feedback"
              />
              <Tab label="Band Scores" icon={<Assessment />} iconPosition="start" />
              <Tab label="Paragraph Analysis" icon={<Article />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {/* Tab 0: Sentence Feedback */}
            {rightPanelTab === 0 && (
              <>
                {selectedSentenceIndex !== null ? (
                  <SentenceFeedbackPanel
                    sentence={feedback.sentences[selectedSentenceIndex]}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      p: 4,
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <Article sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Select a sentence
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click on any sentence in your essay to see detailed feedback here
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* Tab 1: Band Scores */}
            {rightPanelTab === 1 && (
              <Box sx={{ p: 3 }}>
                <BandScoresWithEvidence
                  overallBand={feedback.overallBand}
                  bandScores={feedback.bandScores}
                  topic={feedback.topic}
                />
              </Box>
            )}

            {/* Tab 2: Paragraph Analysis */}
            {rightPanelTab === 2 && (
              <Box sx={{ p: 3 }}>
                <ParagraphAnalysisView
                  paragraphs={feedback.paragraphs}
                  selectedParagraphNumber={selectedParagraphIndex !== null ? feedback.paragraphs[selectedParagraphIndex]?.paragraphNumber : null}
                  onParagraphClick={handleParagraphNumberClick}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
