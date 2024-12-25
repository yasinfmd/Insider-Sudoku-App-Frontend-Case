<script setup lang="ts">

import SudokuGame from './components/SudokuGame.vue';

</script>

<template>
  <div class="app">
    <h1>Sudoku Game</h1>
    <SudokuGame />
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  user-select: none;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

select:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>