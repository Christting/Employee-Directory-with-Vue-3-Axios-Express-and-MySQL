<template>
  <div class="app-wrapper">
    <div class="app-container">
      
      <header class="app-header">
        <div class="header-main">
          <div>
            <h2>UTM HR Employee Management System</h2>
            <p class="subtitle">Streamlined Internal Record Tool v1.0</p>
          </div>
          <button @click="toggleForm" class="btn-toggle-form">
            {{ showForm ? (editingId ? '✕ Close Edit Form' : '✕ Close Form') : '＋ Add New Employee' }}
          </button>
        </div>
      </header>

      <transition name="fade">
        <div v-if="errorBanner" class="error-toast">
          <span class="error-icon">⚠️</span>
          <div class="error-content">
            <strong>Action Required</strong>
            <p>{{ errorBanner }}</p>
          </div>
          <button @click="errorBanner = ''" class="close-toast-btn">&times;</button>
        </div>
      </transition>

      <transition name="slide">
        <EmployeeForm 
          v-if="showForm"
          :employee="selectedEmployee"
          :editingId="editingId"
          @save="saveEmployee"
          @close="toggleForm"
        />
      </transition>

      <EmployeeList 
        :employees="employees"
        :isLoading="isLoading"
        @edit="editEmployee"
        @delete="deleteEmployee"
        @filter-change="handleFilterChange"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

import EmployeeForm from './components/EmployeeForm.vue';
import EmployeeList from './components/EmployeeList.vue';

const showForm = ref(false);
const employees = ref([]);
const isLoading = ref(false);
const errorBanner = ref('');

const editingId = ref(null);
const selectedEmployee = ref(null);

const currentFilters = ref({
  q: '',
  sortBy: 'name',
  order: 'ASC'
});

const fetchEmployees = async () => {
  isLoading.value = true;
  errorBanner.value = '';
  try {
    const response = await api.get('/employees', {
      params: currentFilters.value
    });
    employees.value = response.data;
  } catch (err) {
    errorBanner.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const handleFilterChange = (newFilters) => {
  currentFilters.value = newFilters;
  fetchEmployees();
};

const toggleForm = () => {
  if (showForm.value) {
    editingId.value = null;
    selectedEmployee.value = null;
  }
  showForm.value = !showForm.value;
};

onMounted(() => {
  fetchEmployees();
});

const saveEmployee = async (employeeData) => {

  isLoading.value = true;
  errorBanner.value = '';

  try {

    // UPDATE existing employee
    if (editingId.value) {

      await api.put(
        `/employees/${editingId.value}`,
        employeeData
      );

    }

    // CREATE new employee
    else {

      await api.post(
        '/employees',
        employeeData
      );

    }

    // Reset form state
    editingId.value = null;
    selectedEmployee.value = null;
    showForm.value = false;

    // Refresh employee list
    await fetchEmployees();

  } catch (err) {

    errorBanner.value =
      err.message || 'Failed to save employee';

  } finally {

    isLoading.value = false;

  }

};

const editEmployee = (emp) => {
  selectedEmployee.value = {
    empId: emp.empId,
    name: emp.name,
    email: emp.email,
    department: emp.department,
    position: emp.position,
    hireDate: emp.hireDate?.split('T')[0],
    salary: emp.salary,
    active: emp.active === 1
  };
  editingId.value = emp.id;
  // 💡 藏起来的秘密：在这里点击编辑，自动展开顶部的表单，展示详情！
  showForm.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const deleteEmployee = async (emp) => {
  if (confirm(`Are you sure you want to delete ${emp.name}?`)) {
    isLoading.value = true;
    try {
      await api.delete(`/employees/${emp.id}`);
      await fetchEmployees(); 
    } catch (err) {
      errorBanner.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<style>
/* Global Cream Foundation Overrides */
.app-wrapper {
  background-color: #fbf9f6;
  min-height: 100vh;
  color: #4a433b;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.app-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #f1ece4;
  padding-bottom: 20px;
}
.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}
.app-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #38322b;
  margin: 0 0 4px 0;
}
.subtitle {
  color: #8c8173;
  margin: 0;
  font-size: 0.9rem;
}
.btn-toggle-form {
  background-color: #6e6151;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(110, 97, 81, 0.15);
}
.btn-toggle-form:hover {
  background-color: #574c3f;
  transform: translateY(-1px);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease-out; max-height: 600px; }
.slide-enter-from, .slide-leave-to { transform: translateY(-10px); opacity: 0; max-height: 0; padding: 0; overflow: hidden; }
.error-toast { position: fixed; top: 25px; right: 25px; background: #ffffff; border-left: 4px solid #d95353; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-radius: 6px; padding: 16px 20px; display: flex; align-items: center; gap: 15px; z-index: 9999; max-width: 420px; }
.error-icon { font-size: 1.35rem; }
.error-content strong { display: block; color: #38322b; font-size: 0.9rem; margin-bottom: 2px;}
.error-content p { margin: 0; color: #706556; font-size: 0.85rem; }
.close-toast-btn { background: none; border: none; font-size: 1.25rem; color: #b0a596; cursor: pointer; padding: 0; margin-left: auto; }
</style>