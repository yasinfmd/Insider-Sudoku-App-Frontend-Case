<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import SudokuGrid from './SudokuGrid.vue';
import SudokuControls from './SudokuControls.vue';
import SudokuDigits from './SudokuDigits.vue';
import Leaderboard from './Leaderboard.vue';
import {useSudokuGame} from '../hooks/useSudokuGame';
import type {DifficultyLevel} from '../interfaces/sudoku';
import WinModal from "./WinModal.vue";

const {
  grid,
  rank,
  score,
  hintsUsed,
  selectedCell,
  selectedNumber,
  leaderboard,
  handleKeyPress,
  newGame,
  useHint,
  selectCell,
  isDigitAvailable,
  formattedTime,
  cleanup,
  canUndo,
  canRedo,
  undo,
  redo,
  initialize,
  isGameWon
} = useSudokuGame();

const handleRankChange = (newRank: DifficultyLevel): void => {
  rank.value = newRank;
  newGame();
};


onMounted(async () => {
  await initialize();
});

onUnmounted(() => {
  cleanup();
});


</script>

<template>
  <div
      class="sudoku-game"
      tabindex="0"
      @keydown="handleKeyPress"
  >
    <SudokuControls
        v-model:rank="rank"
        :score="score"
        :hintsUsed="hintsUsed"
        :formattedTime="formattedTime"
        :canUndo="canUndo"
        :canRedo="canRedo"
        :isGameWon="isGameWon"
        @update:rank="handleRankChange"
        @new-game="newGame"
        @use-hint="useHint"
        @undo="undo"
        @redo="redo"
    />

    <div class="game-container">
      <SudokuGrid
          :grid="grid"
          :selectedCell="selectedCell"
          :selectedNumber="selectedNumber"
          @select-cell="selectCell"
      />

      <div class="game-sidebar">
        <SudokuDigits
            :isDigitAvailable="isDigitAvailable"
        />

        <Leaderboard
            :leaderboard="leaderboard"
        />
      </div>
    </div>
    <WinModal
        :show="isGameWon"
        :score="score"
        :formattedTime="formattedTime"
        :hintsUsed="hintsUsed"
        :rank="rank"
        @newGame="newGame"
        :player-name="'Guest player ' + Math.random().toString(36).substring(2, 15)"
    />
  </div>
</template>

<style scoped>
.sudoku-game {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  outline: none;
}

.game-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

.sudoku-game:focus {
  outline: none;
}
</style>