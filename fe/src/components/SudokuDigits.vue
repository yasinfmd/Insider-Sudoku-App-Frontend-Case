<script setup lang="ts">
interface Props {
  isDigitAvailable: (n: number) => boolean;
}

defineProps<Props>();
</script>

<template>
  <div class="available-digits">
    <div
      v-for="n in 9"
      :key="n"
      :class="[ 
        'digit', 
        { 
          'disabled': !isDigitAvailable(n),
       
        } 
      ]"
    >
      {{ n }}
    </div>
  </div>
</template>

<style scoped>
.available-digits {
  display: flex;
  gap: 10px;
}

.digit {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 24px;
  transition: all 0.2s;
  user-select: none; 
}

.digit:hover {
  background-color: #f0f0f0;
}

.digit.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
