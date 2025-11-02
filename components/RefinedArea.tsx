import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import CompareOutlinedIcon from "@mui/icons-material/CompareOutlined";
import Box from "@mui/material/Box";

import { useAtom } from "jotai";
import { ClipboardCopy } from "@/components/ClipboardCopy";

import {
  resultAtom,
  isIELTSModeAtom,
  showDiffAtom,
} from "@/app/atoms";
import { HotkeyHint } from "./HotkeyHint";

export function RefinedArea() {
  const [showDiff, setShowDiff] = useAtom(showDiffAtom);
  const [result] = useAtom(resultAtom);
  const [isIELTS] = useAtom(isIELTSModeAtom);

  // For IELTS mode, the full-screen view in Home.tsx handles rendering
  // This component only shows regular (non-IELTS) refinements

  return (
    <Stack spacing={2} direction="column" flexGrow={1}>
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          textAlign: "left",
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {result}
      </Box>
      <Stack spacing={2} direction="row">
        {result.length > 0 && !isIELTS && (
          <>
            <ClipboardCopy />
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
          </>
        )}
      </Stack>
    </Stack>
  );
}
