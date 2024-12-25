import { apiRequest } from "../http/http";
import type { ApiResponse } from "../interfaces/http";
import type {  LeaderboardEntry } from "../interfaces/sudoku";

export async function getLeaderboard(): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiRequest<LeaderboardEntry[]>('/scores');
  }

export async function saveGameScore(score: Omit<LeaderboardEntry, 'timestamp'>): Promise<ApiResponse<LeaderboardEntry>> {
  return apiRequest<LeaderboardEntry>('/scores', {
    method: 'POST',
    body: JSON.stringify(score),  
  });
}