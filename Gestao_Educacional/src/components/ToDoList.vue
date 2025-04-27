<template>
  <div class="col-sm-12 col-md-6 col-xl-4">
    <div class="h-100 bg-light rounded p-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h6 class="mb-0">To Do List</h6>
        <a href="#">Show All</a>
      </div>
      <div class="d-flex mb-2">
        <input class="form-control bg-transparent" type="text" placeholder="Enter task" />
        <button type="button" class="btn btn-primary ms-2">Add</button>
      </div>
      <!-- Lista fixa por enquanto -->
      <div v-for="i in 3" :key="i" class="d-flex align-items-center border-bottom py-2">
        <input class="form-check-input m-0" type="checkbox" />
        <div class="w-100 ms-3">
          <div class="d-flex w-100 align-items-center justify-content-between">
            <span>Short task goes here...</span>
            <button class="btn btn-sm"><i class="fa fa-times"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
