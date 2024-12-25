export interface Cell {
    value: number | null;
    prefilled: boolean;
    isError: boolean;
  }
  
  export interface Position {
    i: number;
    j: number;
  }
  
  
  export type DifficultyLevel = 'beginner' | 'intermediate' | 'hard' | 'expert';

  export interface LeaderboardEntry {
    playerName: string;
    score: number;
    gameTime: number;
    timestamp: string;
    rank:DifficultyLevel
  }
  
  export interface DifficultyConfig {
    [key: string]: number;
  }
  
  export interface DifficultyOption {
    value: DifficultyLevel;
    label: string;
  }

  export interface GameState {
    grid: Cell[][];
    score: number;
    hintsUsed: number;
  }
  
  export interface GameHistory {
    past: GameState[];
    future: GameState[];
  }