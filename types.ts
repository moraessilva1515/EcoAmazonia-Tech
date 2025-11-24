export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type GameType = 'puzzle' | 'wordsearch' | 'riddle' | 'memory' | 'educationalAdventure' | 'rivercleanup' | 'animalRescue' | 'wordScramble' | 'termo' | 'interactiveQuiz';

export type Language = 'pt' | 'en' | 'es';

export type LocalizedString = {
    [key in Language]: string;
}

export interface LocalizedGameStage {
  stage: number;
  type: GameType;
  title: LocalizedString;
  instructions: LocalizedString;
  data: any; 
  points: number;
}

export interface Guardian {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  cost: number;
  story: LocalizedString;
  activities: LocalizedGameStage[];
  finalQuote: LocalizedString;
  finalReward: number;
}

export interface User {
  username: string;
  password: string; 
  pnBalance: number;
  unlockedGuardians: number[];
  completedOdsQuizzes: number[]; 
  viewedInfographics: number[]; 
  watchedVideos: string[]; 
  guardianProgress: {
    [guardianId: number]: number; 
  };
  name?: string;
  photo?: string; // base64 data URL
  phone?: string;
  email?: string;
  birthdate?: string; // YYYY-MM-DD
}

export interface RiverQuizOption {
  text: string;
  correct: boolean;
}

export interface RiverQuizQuestion {
  question: string;
  options: RiverQuizOption[];
  feedback: string;
}

export type Page = 'home' | 'quiz' | 'infographics' | 'videos' | 'ods' | 'guardioes' | 'profile';