export interface VocabularyWord {
  polish: string;
  english: string;
  category: string;
  gender?: "masculine" | "feminine" | "neuter" | "none";
  pronunciation: string;
  examplePolish: string;
  exampleEnglish: string;
}

export type ExerciseType = "multiple-choice" | "fill-in-the-blank" | "reorder";

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  sentence?: string; // Polish phrase with a blank "___" if type is fill-in-the-blank
  englishPrompt: string; // The baseline English sentence to translate
  options: string[]; // Answer candidates or pool of scrambled words
  correctAnswer: string; // The string matches this exactly
  grammarHint: string; // Pedagogical tip
}

export interface LessonUnit {
  id: string;
  title: string;
  englishTitle: string;
  category: string;
  grammarConcept: string;
  grammarFocus: string;
  grammarExplanation: string;
  words: VocabularyWord[];
  exercises: Exercise[];
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActive: string | null; // ISO Date String
  completedLessons: string[]; // List of Lesson IDs
  bookmarkedWords: string[]; // Polish words that are pinned
  knownWordsCount: number; // For tracking learned cards
}

export interface AIWordAnalysis {
  word: string;
  originalForm: string;
  partOfSpeech: string;
  gender: string;
  grammaticalCase: string;
  roleExplanation: string;
}

export interface AIGrammarReview {
  original: string;
  isCorrect: boolean;
  corrected: string;
  translation: string;
  explanation: string;
  wordsBreakdown: AIWordAnalysis[];
  learningTips: string[];
}

export interface ChatTurn {
  sender: "user" | "marek";
  polish: string;
  english?: string;
  feedback?: string;
  isCorrect?: boolean;
  alternative?: string;
  timestamp: string;
}
