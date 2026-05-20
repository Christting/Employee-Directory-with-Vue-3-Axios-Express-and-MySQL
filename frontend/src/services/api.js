import axios from 'axios';

// 1. Create a centralized Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3001', // Backend server URL
    timeout: 5000,                    // Timeout after 5 seconds
});

// 2. Request Interceptor: Logs the method and URL of every outgoing request
api.interceptors.request.use(config => {
    console.log(`[Outgoing Request] ${config.method.toUpperCase()} -> ${config.url}`);
    return config;
}, error => {
    return Promise.reject(error);
});

// 3. Response Interceptor: Maps server/network errors to a single human-readable message
api.interceptors.response.use(response => {
    return response;
}, error => {
    let message = 'Something went wrong with the network.';
    if (error.response) {
        // Server responded with a status code outside the 2xx range
        message = error.response.data.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
        // Request was made but no response was received
        message = 'No response received from the server. Please check if the backend is running on port 3001.';
    }
    return Promise.reject(new Error(message));
});

export default api;