<script setup lang="ts">
import type {LeaderboardEntry} from '../interfaces/sudoku';

interface Props {
  leaderboard: LeaderboardEntry[];
}

defineProps<Props>();

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min :${secs.toString().padStart(2, '0')} sec`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<template>
  <div class="leaderboard" v-if="leaderboard.length">
    <h3>Top 10 Scores</h3>
    <div
        v-for="(entry, index) in leaderboard"
        :key="index"
        class="leaderboard-entry"
    >
      <span class="rank">#{{ index + 1 }}</span>
      <span>{{ entry.playerName }}</span>
      <span>{{ entry.rank }} level</span>
      <span>{{ entry.score }} points</span>
      <span>({{ formatTime(entry.gameTime) }})</span>
      <span>{{ formatDate(entry.timestamp) }}</span>
    </div>
  </div>
</template>

<style scoped>
.leaderboard {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
  max-height: 420px;
  overflow: auto;
}

.leaderboard h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 16px;
}

.leaderboard div {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.leaderboard div:last-child {
  border-bottom: none;
}

.leaderboard-entry {
  display: flex;
  gap: 4px;
}
</style>
