export type ErrorSeverity = "critical" | "important" | "minor";
export type IELTSCriterion = "TR" | "CC" | "LR" | "GRA";

// Word-level correction within a sentence
export interface WordCorrection {
  original: string; // Word to be deleted/changed
  revised: string; // Corrected word (empty if deletion)
  type: "deletion" | "replacement" | "addition";
}

// Vocabulary suggestion
export interface VocabSuggestion {
  original: string;
  suggestion: string;
  explanation: string; // Why it's better
  example: string; // Example usage
}

// Error detail for a sentence
export interface ErrorDetail {
  type: string; // e.g., "Grammar", "Word Choice", "Punctuation"
  issue: string; // What's wrong
  explanation: string; // Why it's wrong
  howToRevise: string; // Step-by-step guidance
}

// Sentence-level feedback
export interface SentenceFeedback {
  id: string;
  originalSentence: string;
  correctedSentence: string;
  wordCorrections: WordCorrection[]; // Inline corrections
  errors: ErrorDetail[]; // Bullet-point errors
  vocabSuggestions: VocabSuggestion[]; // Better vocabulary options
  criteria: IELTSCriterion[]; // Which criteria this affects
}

// Paragraph-level analysis
export interface ParagraphAnalysis {
  paragraphNumber: number;
  text: string;
  taskAchievement: {
    addressesPrompt: boolean;
    explanation: string;
    suggestions: string[];
  };
  coherenceCohesion: {
    hasTopicSentence: boolean;
    transitions: string; // Quality of transitions
    logicalFlow: string;
    suggestions: string[];
  };
}

// Band score with evidence
export interface IELTSBandScore {
  criterion: IELTSCriterion;
  score: number;
  feedback: string;
  evidence: string[]; // Specific quotes/examples from essay
}

export interface IELTSFeedback {
  topic: string;
  overallBand: number;
  bandScores: IELTSBandScore[];
  sentences: SentenceFeedback[]; // Sentence-by-sentence feedback
  paragraphs: ParagraphAnalysis[]; // Paragraph-level analysis
  overallTA: string; // Overall task achievement assessment
  overallCC: string; // Overall coherence & cohesion assessment
  strengths: string[];
  improvements: string[];
  fullReport: string;
}

export interface InteractiveFeedbackState {
  currentSentenceIndex: number | null;
  reviewedSentences: Set<string>;
}
