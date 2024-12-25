<script setup lang="ts">
import { difficultyLevels } from '../consts/difficultyLevels';
import type { DifficultyLevel } from '../interfaces/sudoku';
import { DEFAULT_HINT_COUNT } from '../consts/defaultHintCount';

interface Props {
  rank: DifficultyLevel;
  score: number;
  hintsUsed: number;
  formattedTime: string;
  canUndo: boolean;
  canRedo: boolean;
  isGameWon: boolean; 
}

defineProps<Props>();


const emit = defineEmits<{
  (e: 'update:rank', value: DifficultyLevel): void;
  (e: 'newGame'): void;
  (e: 'useHint'): void;
  (e: 'undo'): void;
  (e: 'redo'): void;
}>();

const handleRankChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  emit('update:rank', target.value as DifficultyLevel);
};
</script>

<template>
  <div class="controls">
    <div class="control-group">
      <select 
        :value="rank"
        @input="handleRankChange"
        class="difficulty-select"
      >
        <option 
          v-for="level in difficultyLevels"
          :key="level.value"
          :value="level.value"
        >
          {{ level.label }}
        </option>
      </select>

      <button 
        @click="$emit('newGame')"
        class="btn btn-primary"
      >
        New Game
      </button>
    </div>

    <div class="control-group">
        <button 
        @click="$emit('undo')"
        :disabled="!canUndo || isGameWon"
        class="btn btn-secondary"
        title="Undo (Ctrl+Z)"
      >
        ↩️ Undo
      </button>

      <button 
        @click="$emit('redo')"
        :disabled="!canRedo || isGameWon"
        class="btn btn-secondary"
        title="Redo (Ctrl+Y)"
      >
        ↪️ Redo
      </button>

      <button 
        @click="$emit('useHint')"
        :disabled="hintsUsed >= DEFAULT_HINT_COUNT  || isGameWon"
        class="btn btn-hint"
      >
        <span class="hint-icon">💡</span>
        <span class="hint-text">Hint ({{DEFAULT_HINT_COUNT - hintsUsed  }} left)</span>
      </button>
    </div>

    <div class="game-stats">
      <div class="stat-item score">
        <span class="stat-label">Score:</span>
        <span class="stat-value">{{ score }}</span>
      </div>

      <div class="stat-item timer">
        <span class="stat-label">Time:</span>
        <span class="stat-value">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  user-select: none;
}

.control-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.difficulty-select {
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  min-width: 140px;
  height: 40px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.difficulty-select:focus {
  outline: none;
  border-color: #5b9bd5;
  box-shadow: 0 0 0 2px rgba(91, 155, 213, 0.2);
}

.btn {
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary {
  background-color: #4CAF50;
  color: #fff;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-hint {
  background-color: #ff9800;
  color: #fff;
}

.btn-hint:hover {
  background-color: #f57c00;
}

.btn-hint:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.hint-icon {
  font-size: 18px;
}

.game-stats {
  display: flex;
  gap: 20px;
  margin-left: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #333;
  min-width: 60px;
  text-align: right;
}

.score .stat-value {
  color: #4CAF50;
}

.timer .stat-value {
  font-family: monospace;
  font-size: 18px;
}

</style>
