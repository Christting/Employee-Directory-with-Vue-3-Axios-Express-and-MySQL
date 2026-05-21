<template>
  <div class="card form-card-top">
    <div class="card-header">
      <h3>{{ editingId ? 'Edit Employee Profile' : 'Add New Employee Profile' }}</h3>
      <p>Fill in organizational profile details below</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="modern-form-horizontal">
      <div class="form-grid">
        <div class="form-group">
          <label>Employee ID</label>
          <input v-model.trim="form.empId" :disabled="!!editingId" placeholder="e.g. EMP001" :class="{'input-error': errors.empId}" />
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
        <label class="checkbox-wrapper-inline">
          <input type="checkbox" v-model="form.active" />
          Active Employee
        </label>
        <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
        <button type="submit" class="btn-submit-inline">
          {{ editingId ? 'Update Profile' : 'Save Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';

const props = defineProps({
  employee: Object,
  editingId: Number
});

const emit = defineEmits(['save', 'close']);

const form = reactive({
  empId: '', name: '', email: '', department: '', position: '', hireDate: '', salary: 1500, active: true
});

const errors = ref({});

watch(
  () => props.employee,
  (newValue) => {
    if (newValue) {
      Object.assign(form, newValue);
    } else {
      Object.assign(form, {
        empId: '', name: '', email: '', department: '', position: '', hireDate: '', salary: 1500, active: true
      });
    }
  },
  { immediate: true }
);

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  const empIdRegex = /^EMP[0-9]{3,5}$/;
  if (!form.empId) {
    errors.value.empId = 'Required.';
    isValid = false;
  } else if (!empIdRegex.test(form.empId)) {
    errors.value.empId = 'Must be "EMP" + 3-5 digits.';
    isValid = false;
  }

  if (!form.name || form.name.length < 3) {
    errors.value.name = 'Min 3 chars.';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.value.email = 'Invalid format.';
    isValid = false;
  }

  if (!form.department) { errors.value.department = 'Required.'; isValid = false; }
  if (!form.position) { errors.value.position = 'Required.'; isValid = false; }

  if (!form.hireDate) {
    errors.value.hireDate = 'Required.';
    isValid = false;
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (form.hireDate > today) {
      errors.value.hireDate = 'Cannot be in future.';
      isValid = false;
    }
  }

  if (!form.salary || isNaN(form.salary)) {
    errors.value.salary = 'Invalid.';
    isValid = false;
  } else if (form.salary < 1500 || form.salary > 50000) {
    errors.value.salary = 'RM 1,500 - 50,000.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  emit('save', { ...form });
};
</script>

<style scoped>
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
.card-header h3 { margin: 0 0 2px 0; font-size: 1.1rem; color: #38322b; }
.card-header p { margin: 0; font-size: 0.8rem; color: #9c9182; }
.modern-form-horizontal { padding: 24px; background: #fdfdfd; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-size: 0.8rem; font-weight: 600; margin-bottom: 6px; color: #5c5347; }
input, select { width: 100%; padding: 9px 12px; border-radius: 6px; border: 1px solid #dacfc0; background-color: #faf9f6; color: #4a433b; font-size: 0.85rem; box-sizing: border-box; transition: all 0.2s ease; }
input:focus, select:focus { outline: none; border-color: #baa485; background-color: #ffffff; box-shadow: 0 0 0 3px rgba(186, 164, 133, 0.12); }
input.input-error { border-color: #d97373; background-color: #fff8f8; }
.error-text { color: #c54242; font-size: 0.75rem; margin-top: 4px; }
.form-actions-row { display: flex; justify-content: flex-end; align-items: center; gap: 12px; border-top: 1px solid #f4f0e8; padding-top: 16px; }
.checkbox-wrapper-inline { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #5c5347; margin-right: auto; cursor: pointer; }
.btn-cancel { background: #faf9f6; color: #706556; border: 1px solid #dacfc0; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; }
.btn-cancel:hover { background: #f1ece4; }
.btn-submit-inline { background: #137333; color: #ffffff; border: none; padding: 10px 24px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s ease; }
.btn-submit-inline:hover { background: #0f5d29; }
</style>