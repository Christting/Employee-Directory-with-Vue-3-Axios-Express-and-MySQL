<template>
  <div class="toolbar-filter">
    <div class="search-box-wrapper">
      <input
        v-model="searchQuery"
        @input="onFilterChange"
        placeholder="🔍 Search name, ID, or email address..."
        class="input-search"
      />
    </div>

    <div class="sort-controls-wrapper">
      <select v-model="sortColumn" @change="onFilterChange" class="select-sort">
        <option value="name">Sort by Name</option>
        <option value="hireDate">Sort by Hire Date</option>
        <option value="salary">Sort by Salary</option>
      </select>

      <select v-model="sortOrder" @change="onFilterChange" class="select-order">
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filter-change']);

const searchQuery = ref('');
const sortColumn = ref('name');
const sortOrder = ref('ASC');

const onFilterChange = () => {
  emit('filter-change', {
    q: searchQuery.value,
    sortBy: sortColumn.value,
    order: sortOrder.value
  });
};
</script>

<style scoped>
.toolbar-filter {
  padding: 16px 24px;
  background-color: #fdfcfb;
  border-bottom: 1px solid #ede7dd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.search-box-wrapper { flex: 1; min-width: 280px; }
.input-search {
  width: 100%; padding: 10px 14px; border-radius: 6px;
  border: 1px solid #dacfc0; background-color: #ffffff;
  color: #4a433b; font-size: 0.9rem; box-sizing: border-box;
}
.input-search:focus { outline: none; border-color: #baa485; box-shadow: 0 0 0 3px rgba(186,164,133,0.1); }
.sort-controls-wrapper { display: flex; gap: 10px; }
.select-sort, .select-order {
  padding: 10px 12px; border-radius: 6px; border: 1px solid #dacfc0;
  background-color: #ffffff; color: #4a433b; font-size: 0.85rem; cursor: pointer;
}
</style>