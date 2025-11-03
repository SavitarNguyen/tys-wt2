import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { ParagraphAnalysis } from "@/lib/types/ielts";
import { ParagraphFeedbackPanel } from "./ParagraphFeedbackPanel";

interface ParagraphAnalysisViewProps {
  paragraphs: ParagraphAnalysis[];
  selectedParagraphNumber?: number | null;
  onParagraphClick?: (paragraphNumber: number) => void;
}

export function ParagraphAnalysisView({
  paragraphs,
  selectedParagraphNumber,
  onParagraphClick,
}: ParagraphAnalysisViewProps) {
  return (
    <Box>
      {/* Paragraph-by-Paragraph Breakdown */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Paragraph-by-Paragraph Analysis
      </Typography>

      {paragraphs.map((para) => {
        const isSelected = selectedParagraphNumber === para.paragraphNumber;

        return (
          <Accordion
            key={para.paragraphNumber}
            expanded={isSelected}
            onChange={(_, expanded) => {
              if (expanded && onParagraphClick) {
                onParagraphClick(para.paragraphNumber);
              }
            }}
            sx={{
              mb: 2,
              ...(isSelected && {
                boxShadow: 3,
                border: "2px solid",
                borderColor: "primary.main",
              }),
            }}
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
              <ParagraphFeedbackPanel paragraph={para} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
