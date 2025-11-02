"use client";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { RefinerSnackbar } from "@/components/RefinerSnackbar";
import { Editor } from "@/components/Editor";
import { RefinedArea } from "@/components/RefinedArea";
import { useHotkeys } from "react-hotkeys-hook";
import { useRefine } from "./hooks/useRefine";
import { useCopyRefinedContent } from "./hooks/useCopyRefinedContent";
import { useToggleDiff } from "./hooks/useToggleDiff";
import type { Options } from "react-hotkeys-hook/dist/types";
import { Header } from "@/components/Header";
import { InstructionSelector } from "@/components/InstructionSelector";
import { InstructionsToolbar } from "@/components/InstructionsToolbar";
import { SupportUkraineBanner } from "@/components/SupportUkraineBanner";
import { FullScreenFeedbackView } from "@/components/FullScreenFeedbackView";
import { useAtom } from "jotai";
import { ieltsFeedbackAtom, isIELTSModeAtom } from "./atoms";
import { exportMarkdownToWord } from "@/lib/exportToWord";

export function Home({
  showSupportUkraineBanner,
}: {
  showSupportUkraineBanner: boolean;
}) {
  const refine = useRefine();
  const copyRefinedContent = useCopyRefinedContent();
  const toggleDiff = useToggleDiff();
  const [ieltsFeedback, setIeltsFeedback] = useAtom(ieltsFeedbackAtom);
  const [isIELTS] = useAtom(isIELTSModeAtom);

  const hotkeyOptions: Options = {
    enableOnFormTags: true,
    preventDefault: true,
  };

  useHotkeys("mod+enter", refine, hotkeyOptions);
  useHotkeys("mod+shift+c", copyRefinedContent, hotkeyOptions);
  useHotkeys("mod+shift+d", toggleDiff, hotkeyOptions);

  const handleCloseFeedback = () => {
    setIeltsFeedback(null);
  };

  const handleDownloadReport = async () => {
    if (ieltsFeedback?.fullReport) {
      await exportMarkdownToWord(ieltsFeedback.fullReport, "ielts-feedback-report.docx");
    }
  };

  // Show full-screen feedback view when IELTS feedback is available
  const showFullScreenFeedback = isIELTS && ieltsFeedback !== null;

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          display: showFullScreenFeedback ? "none" : "flex",
          flexDirection: "column",
          p: {
            xs: 1,
            md: 2,
          },
        }}
      >
        {showSupportUkraineBanner && <SupportUkraineBanner />}
        <Header>
          <InstructionSelector />
          <InstructionsToolbar />
        </Header>
        <Stack
          spacing={{
            xs: 1,
            md: 2,
          }}
          direction={{
            xs: "column",
            md: "row",
          }}
          sx={{
            flexGrow: 1,
          }}
        >
          <Paper
            sx={{ p: 2, flexGrow: 1, width: { md: "50%" }, display: "flex" }}
          >
            <Editor />
          </Paper>
          <Paper
            sx={{ p: 2, flexGrow: 1, width: { md: "50%" }, display: "flex" }}
          >
            <RefinedArea />
          </Paper>
        </Stack>
        <RefinerSnackbar />
      </Container>

      {/* Full-Screen IELTS Feedback */}
      {showFullScreenFeedback && (
        <FullScreenFeedbackView
          feedback={ieltsFeedback}
          onClose={handleCloseFeedback}
          onDownload={handleDownloadReport}
        />
      )}
    </>
  );
}
