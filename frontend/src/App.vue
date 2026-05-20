<template>
  <div class="app-wrapper">
    <div class="app-container">
      
      <header class="app-header">
        <div class="header-main">
          <div>
            <h2>UTM HR Employee Management System</h2>
            <p class="subtitle">Streamlined Internal Record Tool v1.0</p>
          </div>
          <button @click="showForm = !showForm" class="btn-toggle-form">
            {{ showForm ? '✕ Close Form' : '＋ Add New Employee' }}
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
        <div v-if="showForm" class="card form-card-top">
          <div class="card-header">
            <h3>Add New Employee Profile</h3>
            <p>Fill in organizational profile details below</p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="modern-form-horizontal">
            <div class="form-grid">
              <div class="form-group">
                <label>Employee ID</label>
                <input v-model.trim="form.empId" placeholder="e.g. EMP001" :class="{'input-error': errors.empId}" />
                <span v-if="errors.empId" class="error-text">{{ errors.empId }}</span>
              </div>

              <div class="form-group">
                <label>Full Name</label>
                <input v-model.trim="form.name" placeholder="John Doe" :class="{'input-error': errors.name}" />
                <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <input v-model.trim="form.email" placeholder="john@company.com" :class="{'input-error': errors.email}" />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label>Department</label>
                <select v-model="form.department" :class="{'input-error': errors.department}">
                  <option value="">-- Select --</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
                <span v-if="errors.department" class="error-text">{{ errors.department }}</span>
              </div>

              <div class="form-group">
                <label>Position</label>
                <input v-model.trim="form.position" placeholder="Software Engineer" :class="{'input-error': errors.position}" />
                <span v-if="errors.position" class="error-text">{{ errors.position }}</span>
              </div>

              <div class="form-group">
                <label>Hire Date</label>
                <input type="date" v-model="form.hireDate" :class="{'input-error': errors.hireDate}" />
                <span v-if="errors.hireDate" class="error-text">{{ errors.hireDate }}</span>
              </div>

              <div class="form-group">
                <label>Monthly Salary (RM)</label>
                <input type="number" v-model.number="form.salary" placeholder="Min 1500" :class="{'input-error': errors.salary}" />
                <span v-if="errors.salary" class="error-text">{{ errors.salary }}</span>
              </div>
            </div>

            <div class="form-actions-row">
              <button type="button" @click="showForm = false" class="btn-cancel">Cancel</button>
              <button type="submit" class="btn-submit-inline">Save Profile</button>
            </div>
          </form>
        </div>
      </transition>

      <div class="card table-card-full">
        <div class="card-header">
          <h3>Employee Directory</h3>
          <p>Active Staff Records & Registry Overview</p>
        </div>

        <div class="toolbar-filter">
          <div class="search-box-wrapper">
            <input 
              v-model="searchQuery" 
              @input="handleFilterChange" 
              placeholder="🔍 Search name, ID, or email address..." 
              class="input-search"
            />
          </div>
          <div class="sort-controls-wrapper">
            <select v-model="sortColumn" @change="handleFilterChange" class="select-sort">
              <option value="name">Sort by Name</option>
              <option value="hireDate">Sort by Hire Date</option>
              <option value="salary">Sort by Salary</option>
            </select>
            <select v-model="sortOrder" @change="handleFilterChange" class="select-order">
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
                <th>Department</th>
                <th>Position</th>
                <th>Hire Date</th>
                <th>Salary</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="emp in employees" :key="emp.id" :class="{'inactive-row': !emp.active}">
                <td class="emp-id-cell">{{ emp.empId }}</td>
                <td>
                  <div class="profile-cell">
                    <span class="profile-name">{{ emp.name }}</span>
                    <span class="profile-email">{{ emp.email }}</span>
                  </div>
                </td>
                <td><span class="dept-tag">{{ emp.department }}</span></td>
                <td>{{ emp.position }}</td>
                <td>{{ formatISOData(emp.hireDate) }}</td>
                <td class="salary-cell">{{ formatRM(emp.salary) }}</td>
                <td class="text-center">
                  <button @click="deleteEmployee(emp)" class="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="employees.length === 0">
                <td colspan="7" class="empty-cell">No employee records match your active search criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

const showForm = ref(false);
const employees = ref([]);
const isLoading = ref(false);
const errorBanner = ref('');

// 💡 NEW: Filter states for Search & Sort controls map
const searchQuery = ref('');
const sortColumn = ref('name');
const sortOrder = ref('ASC');

const form = ref({
  empId: '', name: '', email: '', department: '', position: '', hireDate: '', salary: 1500, active: true
});

const errors = ref({});

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  const empIdRegex = /^EMP[0-9]{3,5}$/;
  if (!form.value.empId) {
    errors.value.empId = 'Required.';
    isValid = false;
  } else if (!empIdRegex.test(form.value.empId)) {
    errors.value.empId = 'Must be "EMP" + 3-5 digits.';
    isValid = false;
  }

  if (!form.value.name || form.value.name.length < 3) {
    errors.value.name = 'Min 3 chars.';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email || !emailRegex.test(form.value.email)) {
    errors.value.email = 'Invalid format.';
    isValid = false;
  }

  if (!form.value.department) { errors.value.department = 'Required.'; isValid = false; }
  if (!form.value.position) { errors.value.position = 'Required.'; isValid = false; }

  if (!form.value.hireDate) {
    errors.value.hireDate = 'Required.';
    isValid = false;
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (form.value.hireDate > today) {
      errors.value.hireDate = 'Cannot be in future.';
      isValid = false;
    }
  }

  if (!form.value.salary || isNaN(form.value.salary)) {
    errors.value.salary = 'Invalid.';
    isValid = false;
  } else if (form.value.salary < 1500 || form.value.salary > 50000) {
    errors.value.salary = 'RM 1,500 - 50,000.';
    isValid = false;
  }

  return isValid;
};

// 💡 UPGRADED: Central fetch method passing URL parameters out to Node.js backend
const fetchEmployees = async () => {
  isLoading.value = true;
  errorBanner.value = '';
  try {
    // Pack current search and sorting active configuration parameters inside Axios config
    const response = await api.get('/employees', {
      params: {
        q: searchQuery.value,
        sortBy: sortColumn.value,
        order: sortOrder.value
      }
    });
    employees.value = response.data;
  } catch (err) {
    errorBanner.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// 💡 NEW: Event trigger when input elements or select menus value change
const handleFilterChange = () => {
  fetchEmployees();
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  try {
    await api.post('/employees', form.value);
    form.value = { empId: '', name: '', email: '', department: '', position: '', hireDate: '', salary: 1500, active: true };
    showForm.value = false;
    await fetchEmployees();
  } catch (err) {
    errorBanner.value = err.message;
  } finally {
    isLoading.value = false;
  }
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

const formatRM = (value) => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(value);
};

const formatISOData = (isoString) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped>
/* Milky White & Sophisticated Cream Theme Configuration */
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
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ede7dd;
  box-shadow: 0 4px 20px rgba(140, 129, 115, 0.03);
  overflow: hidden;
  margin-bottom: 30px;
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

/* 💡 NEW: Toolbar Filter Layout Styles Configuration */
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
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #dacfc0;
  background-color: #ffffff;
  color: #4a433b;
  font-size: 0.9rem;
  box-sizing: border-box;
}
.input-search:focus { outline: none; border-color: #baa485; box-shadow: 0 0 0 3px rgba(186, 164, 133, 0.1); }
.sort-controls-wrapper { display: flex; gap: 10px; }
.select-sort, .select-order {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #dacfc0;
  background-color: #ffffff;
  color: #4a433b;
  font-size: 0.85rem;
  cursor: pointer;
}
.select-sort:focus, .select-order:focus { outline: none; border-color: #baa485; }

.modern-form-horizontal {
  padding: 24px;
  background: #fdfdfd;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #5c5347;
}
.modern-form-horizontal input, .modern-form-horizontal select {
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #dacfc0;
  background-color: #faf9f6;
  color: #4a433b;
  font-size: 0.85rem;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.modern-form-horizontal input:focus, .modern-form-horizontal select:focus {
  outline: none;
  border-color: #baa485;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(186, 164, 133, 0.12);
}
.modern-form-horizontal input.input-error {
  border-color: #d97373;
  background-color: #fff8f8;
}
.error-text {
  color: #c54242;
  font-size: 0.75rem;
  margin-top: 4px;
}
.form-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f4f0e8;
  padding-top: 16px;
}
.btn-cancel {
  background: #faf9f6;
  color: #706556;
  border: 1px solid #dacfc0;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #f1ece4;
}
.btn-submit-inline {
  background: #137333;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-submit-inline:hover {
  background: #0f5d29;
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
}
.modern-table tbody tr:hover {
  background-color: #fdfcfb;
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
.text-center { text-align: center; }
.inactive-row { background-color: #fafaf8; opacity: 0.75; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease-out; max-height: 500px; }
.slide-enter-from, .slide-leave-to { transform: translateY(-10px); opacity: 0; max-height: 0; padding: 0; overflow: hidden; }
.error-toast { position: fixed; top: 25px; right: 25px; background: #ffffff; border-left: 4px solid #d95353; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-radius: 6px; padding: 16px 20px; display: flex; align-items: center; gap: 15px; z-index: 9999; max-width: 420px; }
.error-icon { font-size: 1.35rem; }
.error-content strong { display: block; color: #38322b; font-size: 0.9rem; margin-bottom: 2px;}
.error-content p { margin: 0; color: #706556; font-size: 0.85rem; }
.close-toast-btn { background: none; border: none; font-size: 1.25rem; color: #b0a596; cursor: pointer; padding: 0; margin-left: auto; }
.loading-state { padding: 60px; text-align: center; color: #9c9182; }
.spinner { width: 32px; height: 32px; border: 3px solid #f4f0e8; border-top: 3px solid #8c8173; border-radius: 50%; margin: 0 auto 15px auto; animation: spin 0.8s linear infinite; }
.empty-cell { text-align: center; padding: 40px !important; color: #b0a596; font-style: italic; }
</style>