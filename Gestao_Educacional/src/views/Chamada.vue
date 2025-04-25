<template>
  <Spinner />
  <Sidebar />
  <div class="content">
    <SalesTable />
    <ToDoList />
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/Spinner.vue'
import Sidebar from '@/components/Sidebar.vue'
import SalesTable from '@/components/SalesTable.vue'
import ToDoList from '@/components/ToDoList.vue'
</script>
