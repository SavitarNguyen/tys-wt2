import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import CompareOutlinedIcon from "@mui/icons-material/CompareOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAtom } from "jotai";
import { ClipboardCopy } from "@/components/ClipboardCopy";

import {
  resultAtom,
  refinedAtom,
  isIELTSModeAtom,
  showDiffAtom,
} from "@/app/atoms";
import { HotkeyHint } from "./HotkeyHint";
import { exportMarkdownToWord } from "@/lib/exportToWord";

export function RefinedArea() {
  const [showDiff, setShowDiff] = useAtom(showDiffAtom);
  const [result] = useAtom(resultAtom);
  const [refined] = useAtom(refinedAtom);
  const [isIELTS] = useAtom(isIELTSModeAtom);

  // For IELTS mode, render markdown. For regular mode, render diff view
  const shouldRenderMarkdown = isIELTS && refined.length > 0;

  const handleDownloadWord = async () => {
    if (refined.length > 0) {
      await exportMarkdownToWord(refined, "ielts-feedback-report.docx");
    }
  };

  return (
    <Stack spacing={2} direction="column" flexGrow={1}>
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          textAlign: "left",
          flexGrow: 1,
          "& .markdown-body": {
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: 2,
              marginBottom: 1,
              fontWeight: "bold",
            },
            "& h1": { fontSize: "2em", borderBottom: "1px solid #eee", paddingBottom: 0.5 },
            "& h2": { fontSize: "1.5em", borderBottom: "1px solid #eee", paddingBottom: 0.5 },
            "& h3": { fontSize: "1.25em" },
            "& table": {
              borderCollapse: "collapse",
              width: "100%",
              marginTop: 1,
              marginBottom: 1,
              "& th, & td": {
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              },
              "& th": {
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              },
            },
            "& blockquote": {
              borderLeft: "4px solid #ddd",
              paddingLeft: 2,
              marginLeft: 0,
              fontStyle: "italic",
            },
            "& code": {
              backgroundColor: "#f5f5f5",
              padding: "2px 4px",
              borderRadius: "3px",
              fontFamily: "monospace",
            },
            "& pre": {
              backgroundColor: "#f5f5f5",
              padding: 1,
              borderRadius: "4px",
              overflow: "auto",
            },
            "& ul, & ol": {
              marginLeft: 2,
              paddingLeft: 2,
            },
            "& strong": {
              fontWeight: "bold",
              backgroundColor: "#fff3cd",
            },
          },
        }}
        className={shouldRenderMarkdown ? "markdown-body" : ""}
      >
        {shouldRenderMarkdown ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{refined}</ReactMarkdown>
        ) : (
          result
        )}
      </Box>
      <Stack spacing={2} direction="row">
        {((shouldRenderMarkdown && refined.length > 0) ||
          (!shouldRenderMarkdown && result.length > 0)) && (
          <>
            <ClipboardCopy />
            {isIELTS && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadWord}
              >
                Download as Word
              </Button>
            )}
            {!isIELTS && (
              <ToggleButton
                size="small"
                value="check"
                selected={showDiff}
                onChange={() => setShowDiff(!showDiff)}
              >
                <CompareOutlinedIcon />
                {showDiff ? "Hide" : "Show"} diff
                <HotkeyHint hotkey="mod+shift+d" />
              </ToggleButton>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
