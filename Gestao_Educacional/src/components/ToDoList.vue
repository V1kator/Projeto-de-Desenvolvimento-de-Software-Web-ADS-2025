<template>
  <div class="col-sm-12 col-md-6 col-xl-4">
    <div class="h-100 bg-light rounded p-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h6 class="mb-0">To Do List</h6>
        <a href="#">Show All</a>
      </div>

      <div class="d-flex mb-2">
        <input
          v-model="newTask"
          @keyup.enter="addTask"
          class="form-control bg-transparent"
          type="text"
          placeholder="Enter task"
        />
        <button type="button" class="btn btn-primary ms-2" @click="addTask">
          Add
        </button>
      </div>

      <div
        v-for="(task, index) in tasks"
        :key="index"
        class="d-flex align-items-center border-bottom py-2"
      >
        <input
          class="form-check-input m-0"
          type="checkbox"
          v-model="task.done"
        />
        <div class="w-100 ms-3">
          <div
            class="d-flex w-100 align-items-center justify-content-between"
          >
            <span>
              <template v-if="task.done"><del>{{ task.text }}</del></template>
              <template v-else>{{ task.text }}</template>
            </span>
            <button class="btn btn-sm" @click="removeTask(index)">
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const newTask = ref('')
const tasks = ref([
  { text: 'Short task goes here...', done: false },
  { text: 'Another task', done: true },
])

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({ text: newTask.value, done: false })
    newTask.value = ''
  }
}

function removeTask(index: number) {
  tasks.value.splice(index, 1)
}
</script>
