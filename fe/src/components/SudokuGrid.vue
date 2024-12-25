<script setup lang="ts">
import type { Cell, Position } from '../interfaces/sudoku';

interface Props {
  grid: Cell[][];
  selectedCell: Position | null;
  selectedNumber: number | null;
}
const props = defineProps<Props>();
 defineEmits<{
  (e: 'selectCell', i: number, j: number): void;
}>()

const isSelected = (i: number, j: number): boolean => {
  return !!props.selectedCell &&
         props.selectedCell.i === i &&
         props.selectedCell.j === j;
};

const isInSameBox = (i: number, j: number): boolean => {
  if (!props.selectedCell) return false;
  const boxRow = Math.floor(i / 3);
  const boxCol = Math.floor(j / 3);
  const selectedBoxRow = Math.floor(props.selectedCell.i / 3);
  const selectedBoxCol = Math.floor(props.selectedCell.j / 3);
  
  return boxRow === selectedBoxRow && boxCol === selectedBoxCol;
};

const isInSameRow = (i: number): boolean => {
  return !!props.selectedCell && props.selectedCell.i === i;
};

const isInSameColumn = (j: number): boolean => {
  return !!props.selectedCell && props.selectedCell.j === j;
};
const hasSameNumber = (cell: Cell): boolean => {
  return !!cell.value && cell.value === props.selectedNumber;
};
</script>

<template>
  <div class="grid">
    <div v-for="(row, i) in grid" :key="i" class="row">
      <div
        v-for="(cell, j) in row"
        :key="j"
        :class="[ 
          'cell', 
          { 
            'prefilled': cell.prefilled, 
            'error': cell.isError,
            'selected': isSelected(i, j),
            'same-box': isInSameBox(i, j),
            'same-number': hasSameNumber(cell),
            'same-row': isInSameRow(i),
            'same-column': isInSameColumn(j)
          }
        ]"
        @click="$emit('selectCell', i, j)"
      >
        {{ cell.value || '' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 2px;
  background: #ccc;
  padding: 2px;
}

.row {
  display: grid;
  grid-template-columns: repeat(9, 56px);
  gap: 2px;
}

.cell {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  font-size: 24px;
  user-select: none;
}

.cell.prefilled {
  font-weight: bold;
  background: #f0f0f0;
}

.cell.selected {
  border: 4px dashed #4CAF50;
  animation: blink 1s infinite;
}

.cell.error {
  background: #ffebee;
  color: #d32f2f;
}

.cell.same-box {
  background-color: rgba(37, 150, 190, 0.1);
}

.cell.same-number {
  background-color: rgba(37, 150, 190, 0.2);
}

.cell.same-row,
.cell.same-column {
  background-color: rgba(37, 150, 190, 0.1);
}

@keyframes blink {
  0% {
    background-color: rgba(76, 175, 80, 0.3);
  }
  50% {
    background-color: rgba(76, 175, 80, 0.6);
  }
  100% {
    background-color: rgba(76, 175, 80, 0.3);
  }
}
</style>
