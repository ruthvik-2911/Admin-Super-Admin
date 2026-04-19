import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AdminRegistrationData {
  companyName: string;
  authorizedPerson: string;
  businessAddress: string;
  gstNumber?: string;
  mobileNumber: string;
  emailId: string;
  gstCertificate?: File;
  companyRegistrationDoc: File;
  idProof: File;
}

export const adminApi = {
  register: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  checkRegistrationStatus: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/admin/status?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Email/Password Login
  login: async (identifier: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/login', {
        identifier,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // OTP Login - Send OTP
  sendOtp: async (mobileNumber: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/send-otp', {
        mobileNumber,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // OTP Login - Verify OTP
  verifyOtp: async (mobileNumber: string, otp: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/verify-otp', {
        mobileNumber,
        otp,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Session Management
  validateSession: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/api/admin/validate-session');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/logout');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};
