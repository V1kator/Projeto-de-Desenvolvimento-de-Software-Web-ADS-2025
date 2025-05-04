<template>
  <div class="p-4">
    <label for="date" class="form-label">Selecione a data da chamada:</label>
    <input
      type="date"
      id="date"
      class="form-control"
      v-model="selectedDate"
      @change="emitDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selectedDate = ref(new Date().toISOString().split('T')[0])

const emit = defineEmits<{
  (e: 'update:date', value: string): void
}>()

function emitDate() {
  emit('update:date', selectedDate.value)
}
</script>
