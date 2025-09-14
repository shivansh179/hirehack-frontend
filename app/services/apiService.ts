import axios from 'axios';
import { Interview } from '../../app/dashboard/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const createAdminHeaders = () => {
    const adminPhone = localStorage.getItem('adminPhoneNumber');
    if (!adminPhone) throw new Error("Admin not logged in");
    return { 'X-Admin-Phone-Number': adminPhone };
};

export const verifyAdmin = (phoneNumber: string) => {
    return apiClient.post('/admin/verify', { phoneNumber });
};

export const getAdminStats = () => {
    return apiClient.get('/admin/stats', { headers: createAdminHeaders() });
};

export const getAllUsers = () => {
    return apiClient.get('/admin/users', { headers: createAdminHeaders() });
};

export const getAllInterviews = () => {
    return apiClient.get<Interview[]>('/admin/interviews', { headers: createAdminHeaders() });
};


export const checkUserExists = (phoneNumber: string) => {
  const formattedPhoneNumber = phoneNumber.replace('+', '');
  return apiClient.get(`/users/check/${formattedPhoneNumber}`);
};

export const registerUser = (userData: {
  phoneNumber: string;
  fullName: string;
  profession: string;
  yearsOfExperience: number;
}) => {
  return apiClient.post('/users/register', userData);
};

export const uploadResume = (formData: FormData) => {
  return apiClient.post('/users/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const startInterview = (interviewData: {
  phoneNumber: string;
  interviewDurationMinutes: number;
  role: string;
  skills: string;
  interviewType: string;
}) => {
  return apiClient.post('/interviews/start', interviewData);
};

export const postChatMessage = (interviewId: number, message: string) => {
  return apiClient.post(`/interviews/${interviewId}/chat`, { message });
};

export const getInterviewHistory = (phoneNumber: string) => {
  const formattedPhoneNumber = phoneNumber.replace('+', '');
  return apiClient.get<Interview[]>(`/interviews/history/${formattedPhoneNumber}`);
};

export const generateFeedback = (interviewId: number) => {
  return apiClient.post(`/interviews/${interviewId}/generate-feedback`);
};