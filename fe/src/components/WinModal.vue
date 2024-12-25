<template>
  <div v-if="show" class="win-modal-overlay">
    <div class="win-modal">
      <h2>🎉 Tebrikler! 🎉</h2>
      <div class="game-stats">
        <p>Oyuncu Adı: {{ playerName }}</p>
        <p class="score">Skorunuz: {{ score }}</p>
        <p>Súreniz: {{ formattedTime }}</p>
        <p>Kullanılan İpucu: {{ hintsUsed }}/3</p>
        <p>Zorluk: {{ rank }}</p>
      </div>
      <button class="new-game-btn" @click="onNewGame">
        ▶️
        Yeni Oyun
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  score: number;
  formattedTime: string;
  hintsUsed: number;
  rank: string;
  playerName:string;
}>();

const emit = defineEmits<{
  (e: 'newGame'): void;
}>();

const onNewGame = () => {
  emit('newGame');
};
</script>

<style scoped>
.win-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  user-select: none;
}

.win-modal {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  min-width: 500px;
  animation: slideIn 0.3s ease;
}

.win-modal h2 {
  color: #2c3e50;
  margin-bottom: 24px;
  font-size: 28px;
}

.game-stats {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.game-stats p {
  margin: 8px 0;
  font-size: 18px;
  color: #495057;
}

.score {
  font-weight: bold;
}

.new-game-btn {
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 8px;
  transition: background 0.2s;
}

.new-game-btn:hover {
  background: #45a049;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
