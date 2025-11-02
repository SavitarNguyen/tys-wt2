# Interactive IELTS Feedback Feature

## Overview

Transform overwhelming IELTS feedback into an engaging, game-like learning experience where students explore corrections one at a time through interactive flashcards.

## Features

### 1. **Flashcard Learning System**
Students navigate through errors one at a time, seeing:
- What's wrong (1 sentence explanation)
- Why it matters for band score (1 sentence)
- The correction
- Example of correct usage

### 2. **Color-Coded Error Highlights**
Click on any highlighted error in the original essay:
- 🔴 **Critical** (Red) - Grammar errors affecting meaning (GRA)
- 🟡 **Important** (Yellow) - Vocabulary, coherence, task response issues (TR/CC/LR)
- 🟢 **Minor** (Green) - Style improvements

### 3. **Progressive Disclosure UI**
Four tabs to reduce cognitive overload:
- **Learn Errors** - Flashcard mode for reviewing errors
- **Your Essay** - Interactive essay with clickable highlights
- **Band Scores** - Criterion scores with detailed feedback
- **Full Report** - Complete markdown report for reference

### 4. **Gamification Elements**
- Progress tracking: X/Y errors reviewed
- Visual progress bar
- Checkmarks on reviewed errors
- Completion celebration

## Architecture

### Components Created

```
components/
├── ErrorHighlight.tsx          # Clickable error highlights with tooltips
├── ErrorFlashcard.tsx          # Beautiful flashcard UI for learning
├── InteractiveEssay.tsx        # Essay view with highlighted errors
└── InteractiveIELTSFeedback.tsx # Main component with tabs

lib/types/
└── ielts.ts                    # TypeScript interfaces
```

### Data Flow

1. **User submits essay** → Selects "IELTS Feedback" instruction
2. **Gemini API** → Returns structured JSON with errors array
3. **Parser** → Converts JSON to `IELTSFeedback` type
4. **Interactive UI** → Renders flashcards, highlights, tabs

### JSON Structure

```typescript
{
  "topic": string,
  "overallBand": number,
  "bandScores": Array<{criterion, score, feedback}>,
  "errors": Array<{
    id, originalText, correction,
    explanation, reason, example,
    severity, criteria, position
  }>,
  "strengths": string[],
  "improvements": string[],
  "fullReport": string
}
```

## Usage

1. **Enter essay** in the left editor
2. **Select "IELTS Feedback"** from AI Corrector group
3. **Click Refine** (or Cmd+Enter)
4. **Explore feedback:**
   - Navigate flashcards with arrow buttons
   - Click highlights in your essay
   - Review band scores by criterion
   - Download full report as Word doc

## Benefits

- **Less overwhelming** - One error at a time vs. wall of text
- **More engaging** - Game-like with progress tracking
- **Better learning** - Understand WHY errors matter
- **Quick scanning** - Color-coded by severity
- **Flexible** - Choose your learning path (flashcards vs. essay view)

## Technical Details

- **AI Provider:** Google Gemini (with JSON mode)
- **State Management:** Jotai atoms
- **UI Framework:** Material-UI
- **Type Safety:** Full TypeScript support
- **Responsive:** Works on mobile and desktop
