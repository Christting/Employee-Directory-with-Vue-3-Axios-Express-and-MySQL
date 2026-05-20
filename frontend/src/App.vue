<template>
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h2>UTM HR Employee Directory</h2>

    <div v-if="errorBanner" style="color: #c5221f; padding: 10px; background-color: #fce8e6; margin-bottom: 15px; border-radius: 4px;">
      ⚠️ Error: {{ errorBanner }}
    </div>

    <div v-if="isLoading" style="margin-bottom: 15px; color: #666;">
      Loading employee data, please wait...
    </div>

    <table v-else border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px;">Emp ID</th>
          <th style="padding: 10px;">Name</th>
          <th style="padding: 10px;">Department</th>
          <th style="padding: 10px;">Position</th>
          <th style="padding: 10px;">Hire Date</th>
          <th style="padding: 10px;">Salary</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp.id">
          <td style="padding: 10px;">{{ emp.empId }}</td>
          <td style="padding: 10px;">
            <strong>{{ emp.name }}</strong><br>
            <small style="color: #666;">{{ emp.email }}</small>
          </td>
          <td style="padding: 10px;">{{ emp.department }}</td>
          <td style="padding: 10px;">{{ emp.position }}</td>
          <td style="padding: 10px;">{{ formatISOData(emp.hireDate) }}</td>
          <td style="padding: 10px;">{{ formatRM(emp.salary) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api'; // Import the centralized Axios instance

// Reactive variables to hold states
const employees = ref([]);
const isLoading = ref(false);
const errorBanner = ref('');

// Fetch all records from backend on page load [cite: 45]
const fetchEmployees = async () => {
  isLoading.value = true;
  errorBanner.value = '';
  try {
    // Using async/await as required by the assignment brief [cite: 60]
    const response = await api.get('/employees');
    employees.value = response.data;
  } catch (err) {
    errorBanner.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Format Salary into Malaysian Ringgit (RM) layout 
const formatRM = (value) => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(value);
};

// Helper function to clean up ISO date format (YYYY-MM-DD) [cite: 40]
const formatISOData = (isoString) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

// Lifecycle hook to trigger data fetch automatically [cite: 45]
onMounted(() => {
  fetchEmployees();
});
</script>