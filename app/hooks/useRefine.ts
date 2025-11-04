import { useAtom } from "jotai";
import {
  instructionNamesAtom,
  isIELTSModeAtom,
  loadingAtom,
  refinedAtom,
  resultAtom,
  textAtom,
  ieltsFeedbackAtom,
  streamingProgressAtom,
  streamingStatusAtom,
  streamingCharsReceivedAtom,
} from "../atoms";
import { compareStrings } from "../utils";
import { IELTSFeedback } from "@/lib/types/ielts";

export function useRefine() {
  const [text] = useAtom(textAtom);
  const [instructionNames] = useAtom(instructionNamesAtom);
  const [, setLoading] = useAtom(loadingAtom);
  const [, setResult] = useAtom(resultAtom);
  const [, setRefined] = useAtom(refinedAtom);
  const [, setIsIELTSMode] = useAtom(isIELTSModeAtom);
  const [, setIeltsFeedback] = useAtom(ieltsFeedbackAtom);
  const [, setStreamingProgress] = useAtom(streamingProgressAtom);
  const [, setStreamingStatus] = useAtom(streamingStatusAtom);
  const [, setStreamingCharsReceived] = useAtom(streamingCharsReceivedAtom);

  return async function refine() {
    if (text.trim().length === 0) {
      setRefined("");
      setResult([]);
      setIsIELTSMode(false);
      setIeltsFeedback(null);
      setStreamingProgress(0);
      setStreamingStatus("");
      setStreamingCharsReceived(0);
      return;
    }
    setResult([]);
    setLoading(true);

    // Check if IELTS mode is active
    const isIELTS = instructionNames.includes("ielts");
    setIsIELTSMode(isIELTS);

    // Initialize streaming progress
    setStreamingProgress(0);
    setStreamingStatus("Preparing to analyze your essay...");
    setStreamingCharsReceived(0);

    try {
      const response = await fetch("api/v1/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, instructionNames, stream: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine text");
      }

      // Check if response is streaming (event-stream) or regular JSON
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("text/event-stream")) {
        // Handle streaming response
        await handleStreamingResponse(response, isIELTS, text);
      } else {
        // Fallback to non-streaming response
        const data = await response.json();
        const localRefined = data["refined"];
        setRefined(localRefined);

        if (!isIELTS) {
          setResult(compareStrings(text, localRefined));
          setIeltsFeedback(null);
        } else {
          try {
            const feedbackData: IELTSFeedback = JSON.parse(localRefined);
            setIeltsFeedback(feedbackData);
            setResult([]);
          } catch (error) {
            console.error("Failed to parse IELTS feedback JSON:", error);
            setResult([]);
          }
        }
      }
    } catch (error) {
      console.error("Refine error:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleStreamingResponse(response: Response, isIELTS: boolean, originalText: string) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    // Estimated target size for IELTS JSON response (~60000-70000 chars based on actual responses)
    const estimatedTotalChars = isIELTS ? 60000 : 5000;

    if (!reader) {
      console.error("No reader available");
      return;
    }

    // Helper function to get status message based on progress
    const getStatusMessage = (progress: number): string => {
      if (progress < 15) return "Reading your essay...";
      if (progress < 35) return "Analyzing grammar and vocabulary...";
      if (progress < 55) return "Evaluating coherence and cohesion...";
      if (progress < 75) return "Assessing task achievement...";
      if (progress < 95) return "Generating detailed feedback...";
      return "Finalizing your results...";
    };

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);

          if (data === "[DONE]") {
            // Stream complete - set to 100%
            setStreamingProgress(100);
            setStreamingStatus("Complete!");
            setRefined(accumulatedText);

            if (!isIELTS) {
              setResult(compareStrings(originalText, accumulatedText));
              setIeltsFeedback(null);
            } else {
              try {
                const feedbackData: IELTSFeedback = JSON.parse(accumulatedText);
                setIeltsFeedback(feedbackData);
                setResult([]);
              } catch (error) {
                console.error("Failed to parse IELTS feedback JSON:", error);
                console.log("Accumulated text length:", accumulatedText.length);
              }
            }
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              accumulatedText += parsed.chunk;
              const currentLength = accumulatedText.length;

              // Update streaming state
              setStreamingCharsReceived(currentLength);

              // Calculate progress (capped at 95% until [DONE])
              const rawProgress = Math.min((currentLength / estimatedTotalChars) * 100, 95);
              const progress = Math.floor(rawProgress);
              setStreamingProgress(progress);
              setStreamingStatus(getStatusMessage(progress));

              // Update refined text progressively for non-IELTS mode
              if (!isIELTS) {
                setRefined(accumulatedText);
                setResult(compareStrings(originalText, accumulatedText));
              }

              console.log(`Received ${currentLength} characters (${progress}%): ${getStatusMessage(progress)}`);
            } else if (parsed.error) {
              console.error("Streaming error:", parsed.error);
              setStreamingStatus("Error occurred");
            }
          } catch (e) {
            // Ignore JSON parse errors for partial data
            console.warn("Could not parse chunk:", data);
          }
        }
      }
    }
  }
}
