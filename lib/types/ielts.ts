export type ErrorSeverity = "critical" | "important" | "minor";
export type IELTSCriterion = "TR" | "CC" | "LR" | "GRA";

// IELTS error for interactive error learning
export interface IELTSError {
  id: string;
  severity: ErrorSeverity;
  criteria: IELTSCriterion[];
  originalText: string;
  explanation: string; // What's wrong
  reason: string; // Why it matters
  correction: string; // The corrected text
  example: string; // Example usage
  position: {
    start: number;
    end: number;
  };
}
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

// Paragraph issue/error detail (similar to ErrorDetail for sentences)
export interface ParagraphIssue {
  criterion: "TR" | "CC"; // Task Response or Coherence & Cohesion
  type: string; // e.g., "Vague Main Idea", "Weak Evidence", "Poor Transitions"
  issue: string; // What's the problem
  explanation: string; // Why it's problematic
  howToRevise: string; // How to fix it
  quote?: string; // Optional: specific quote from paragraph
}

// Paragraph improvement suggestion (not an error, but could be better)
export interface ParagraphImprovement {
  type: string; // e.g., "Idea Development", "Evidence Quality"
  current: string; // What the student currently has
  suggestion: string; // What could make it better
  explanation: string; // Why the suggestion helps
  bandImpact: string; // e.g., "Could move from Band 6 to 6.5-7"
}

// Paragraph-level analysis
export interface ParagraphAnalysis {
  paragraphNumber: number;
  text: string;
  revisedParagraph: string; // Idea-focused revision based on improvement steps
  overallParagraphBand: string;
  issues: ParagraphIssue[]; // Red boxes - errors and bad ideas
  improvements: ParagraphImprovement[]; // Yellow boxes - upgrade opportunities
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
  errors: IELTSError[]; // Flat array of all errors for interactive learning
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
