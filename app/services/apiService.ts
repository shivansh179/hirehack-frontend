import axios from 'axios';
import { Interview } from '../../app/dashboard/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userPhoneNumber');
          window.location.href = '/auth';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const sendOtp = (phoneNumber: string) => {
  return apiClient.post('/api/auth/send-otp', { phoneNumber });
};

export const verifyOtp = (phoneNumber: string, otp: string) => {
  return apiClient.post('/api/auth/verify-otp', { phoneNumber, otp });
};

export const registerUser = (userData: {
  phoneNumber: string;
  fullName: string;
  profession: string;
  yearsOfExperience: number;
}) => {
  return apiClient.post('/api/auth/register', userData);
};

export const loginUser = (phoneNumber: string) => {
  return apiClient.post('/api/auth/login', { phoneNumber });
};

export const refreshToken = (refreshToken: string) => {
  return apiClient.post('/api/auth/refresh', { refreshToken });
};

export const validatePhoneNumber = (phoneNumber: string) => {
  return apiClient.get(`/api/auth/validate-phone/${phoneNumber}`);
};

// User endpoints
export const getUserProfile = () => {
  return apiClient.get('/api/users/profile');
};

export const updateUserProfile = (userData: {
  fullName?: string;
  profession?: string;
  yearsOfExperience?: number;
}) => {
  return apiClient.post('/api/users/update-profile', userData);
};

export const checkUserExists = (phoneNumber: string) => {
  return apiClient.get(`/api/users/check/${phoneNumber}`);
};

export const uploadResume = (formData: FormData) => {
  return apiClient.post('/api/users/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Interview endpoints
export const startInterview = (interviewData: {
  interviewDurationMinutes: number;
  role: string;
  skills: string;
  interviewType: string;
}) => {
  return apiClient.post('/api/interviews/start', interviewData);
};

export const postChatMessage = (interviewId: number, message: string) => {
  return apiClient.post(`/api/interviews/${interviewId}/chat`, { message });
};

export const getInterviewHistory = () => {
  return apiClient.get<Interview[]>('/api/interviews/history');
};

export const generateFeedback = (interviewId: number) => {
  return apiClient.post(`/api/interviews/${interviewId}/generate-feedback`);
};

export const endInterview = (interviewId: number) => {
  return apiClient.post(`/api/interviews/${interviewId}/end`);
};

export const getInterviewById = (interviewId: number) => {
  return apiClient.get(`/api/interviews/${interviewId}`);
};

// Admin endpoints
export const verifyAdmin = () => {
  return apiClient.get('/api/admin/verify');
};

export const getAdminStats = () => {
  return apiClient.get('/api/admin/stats');
};

export const getAllUsers = () => {
  return apiClient.get('/api/admin/users');
};

export const getAllInterviews = () => {
  return apiClient.get<Interview[]>('/api/admin/interviews');
};