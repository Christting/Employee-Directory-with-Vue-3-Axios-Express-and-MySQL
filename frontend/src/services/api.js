import axios from 'axios';

const api = axios.create({

  baseURL: 'http://localhost:3001',

  timeout: 5000,

  headers: {
    'Content-Type': 'application/json'
  }

});

// Request interceptor
api.interceptors.request.use(

  (config) => {

    console.log(
      `[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }

);

// Response interceptor
api.interceptors.response.use(

  (response) => response,

  (error) => {

    let message = 'Something went wrong';

    if (error.response) {

      message =
        error.response.data?.message ||
        'Server error occurred';

    }

    else if (error.request) {

      message = 'Unable to connect to server';

    }

    else {

      message = error.message;

    }

    return Promise.reject(new Error(message));

  }

);

export default api;