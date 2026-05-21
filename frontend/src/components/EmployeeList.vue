import SearchSort from './SearchSort.vue';
<template>
  <div class="card table-card-full">
    <div class="card-header">
      <h3>Employee Directory</h3>
      <p>Active Staff Records & Registry Overview (Click Profile or Edit to modify)</p>
    </div>

    <SearchSort @filter-change="$emit('filter-change', $event)" />

      <div class="sort-controls-wrapper">

        <select
          v-model="sortColumn"
          @change="onFilterChange"
          class="select-sort"
        >
          <option value="name">Sort by Name</option>
          <option value="hireDate">Sort by Hire Date</option>
          <option value="salary">Sort by Salary</option>
        </select>

        <select
          v-model="sortOrder"
          @change="onFilterChange"
          class="select-order"
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>

      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Fetching database records...</p>
    </div>
    
    <div v-else class="table-responsive">

      <table class="modern-table">

        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Staff Profile</th>
            <th>Status</th>
            <th>Department</th>
            <th>Position</th>
            <th>Hire Date</th>
            <th>Salary</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr 
            v-for="emp in employees" 
            :key="emp.id" 
            :class="{ 'inactive-row': !emp.active }"
            class="clickable-row"
          >

            <td
              class="emp-id-cell"
              @click="$emit('edit', emp)"
            >
              {{ emp.empId }}
            </td>

            <td @click="$emit('edit', emp)">

              <div class="profile-cell">

                <span class="profile-name">
                  {{ emp.name }}
                </span>

                <span class="profile-email">
                  {{ emp.email }}
                </span>

              </div>

            </td>

            <!-- ACTIVE / INACTIVE STATUS -->
            <td @click="$emit('edit', emp)">

              <span
                :class="
                  emp.active
                    ? 'status-active'
                    : 'status-inactive'
                "
              >

                {{ emp.active ? 'Active' : 'Inactive' }}

              </span>

            </td>

            <td @click="$emit('edit', emp)">
              <span class="dept-tag">
                {{ emp.department }}
              </span>
            </td>

            <td @click="$emit('edit', emp)">
              {{ emp.position }}
            </td>

            <td @click="$emit('edit', emp)">
              {{ formatISOData(emp.hireDate) }}
            </td>

            <td
              class="salary-cell"
              @click="$emit('edit', emp)"
            >
              {{ formatRM(emp.salary) }}
            </td>

            <td class="text-center">

              <div class="action-btn-group">

                <button
                  @click="$emit('edit', emp)"
                  class="btn-edit-link"
                >
                  ✏️Edit
                </button>

                <button
                  @click="$emit('delete', emp)"
                  class="btn-delete"
                >
                  Delete
                </button>

              </div>

            </td>

          </tr>

          <tr v-if="employees.length === 0">

            <td colspan="8" class="empty-cell">
              No employee records match your active search criteria.
            </td>

          </tr>

        </tbody>

      </table>

    </div>

</template>

<script setup>

defineProps({
  employees: Array,
  isLoading: Boolean
});

const emit = defineEmits(['edit', 'delete', 'filter-change']);




const formatRM = (value) => {
  return new Intl.NumberFormat(
    'ms-MY',
    {
      style: 'currency',
      currency: 'MYR'
    }
  ).format(value);
};

const formatISOData = (isoString) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};
</script>

<style scoped>

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ede7dd;
  box-shadow: 0 4px 20px rgba(140, 129, 115, 0.03);
  overflow: hidden;
}

.card-header {
  padding: 18px 24px;
  background: #fdfcfb;
  border-bottom: 1px solid #f4f0e8;
}

.card-header h3 {
  margin: 0 0 2px 0;
  font-size: 1.1rem;
  color: #38322b;
}

.card-header p {
  margin: 0;
  font-size: 0.8rem;
  color: #9c9182;
}

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

.search-box-wrapper {
  flex: 1;
  min-width: 280px;
}

.input-search {
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #dacfc0;
  background-color: #ffffff;
  color: #4a433b;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.input-search:focus {
  outline: none;
  border-color: #baa485;
  box-shadow: 0 0 0 3px rgba(186, 164, 133, 0.1);
}

.sort-controls-wrapper {
  display: flex;
  gap: 10px;
}

.select-sort,
.select-order {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #dacfc0;
  background-color: #ffffff;
  color: #4a433b;
  font-size: 0.85rem;
  cursor: pointer;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.modern-table th {
  background-color: #fbf9f6;
  padding: 14px 18px;
  font-weight: 600;
  color: #706556;
  text-align: left;
  border-bottom: 2px solid #ede7dd;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.modern-table td {
  padding: 16px 18px;
  border-bottom: 1px solid #f4f0e8;
  color: #5c5347;
  transition: background 0.2s ease;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover td {
  background-color: #fcfbfa;
}

.emp-id-cell {
  font-family: monospace;
  font-weight: bold;
  color: #8c765c;
  font-size: 0.95rem;
}

.profile-cell {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 600;
  color: #38322b;
}

.profile-email {
  font-size: 0.8rem;
  color: #9c9182;
  margin-top: 2px;
}

.dept-tag {
  background: #f1ece4;
  color: #6e6151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.salary-cell {
  font-weight: 600;
  color: #4a433b;
}

.action-btn-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn-edit-link {

  background: #c4a477;
  color: #ffffff;

  border: none;

  padding: 8px 14px;

  border-radius: 6px;

  font-size: 0.85rem;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;

  box-shadow: 0 2px 6px rgba(186, 164, 133, 0.2);

}

.btn-edit-link:hover {

  background: #9e8260;

  transform: translateY(-1px);

  box-shadow: 0 4px 10px rgba(140, 118, 92, 0.25);

}

.btn-delete {
  color: #c54242;
  background: #fff5f5;
  border: 1px solid #fcdada;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  color: #ffffff;
  background: #d95353;
  border-color: #d95353;
}

.text-center {
  text-align: center;
}

.inactive-row {
  background-color: #fafaf8;
  opacity: 0.75;
}

/* ACTIVE / INACTIVE BADGE */

.status-active {

  background-color: #d1fae5;
  color: #065f46;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 12px;
  font-weight: bold;

}

.status-inactive {

  background-color: #fee2e2;
  color: #991b1b;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 12px;
  font-weight: bold;

}

.loading-state {
  padding: 60px;
  text-align: center;
  color: #9c9182;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f4f0e8;
  border-top: 3px solid #8c8173;
  border-radius: 50%;
  margin: 0 auto 15px auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {

  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }

}

.empty-cell {
  text-align: center;
  padding: 40px !important;
  color: #b0a596;
  font-style: italic;
}

</style>