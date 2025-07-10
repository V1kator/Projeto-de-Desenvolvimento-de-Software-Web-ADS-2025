<template>
  <input
    type="date"
    class="form-control"
    :max="dataHoje"
    v-model="dataInterna"
    @change="emitirData"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ value: string }>()
const emit = defineEmits<{ (e: 'update:date', value: string): void }>()

const dataHoje = new Date().toISOString().split('T')[0]
const dataInterna = ref(props.value)

watch(() => props.value, val => (dataInterna.value = val))

function emitirData() {
  emit('update:date', dataInterna.value)
}
</script>

