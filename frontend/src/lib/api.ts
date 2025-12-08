import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Exam {
  id: string;
  course: string;
  date: string;
}

export interface Copy {
  id: string;
  exam_id: string;
  file_path: string;
  grade: number | null;
  annotations: object | null;
}

export interface CorrectionResult {
  id: string;
  grade: number;
  annotations: object;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, role: 'student' | 'professor' | 'admin') => {
    const response = await api.post<User>('/auth/register', { email, password, role });
    return response.data;
  },

  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Store token in localStorage
    localStorage.setItem('access_token', response.data.access_token);

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Exams API
export const examsAPI = {
  createExam: async (course: string, date: string) => {
    const response = await api.post<Exam>('/exams', { course, date });
    return response.data;
  },

  getExams: async () => {
    const response = await api.get<Exam[]>('/exams');
    return response.data;
  },

  getExam: async (examId: string) => {
    const response = await api.get<Exam>(`/exams/${examId}`);
    return response.data;
  },

  updateExam: async (examId: string, data: { course?: string; date?: string }) => {
    const response = await api.patch<Exam>(`/exams/${examId}`, data);
    return response.data;
  },

  deleteExam: async (examId: string) => {
    await api.delete(`/exams/${examId}`);
  },
};

// Copies API
export const copiesAPI = {
  uploadCopy: async (examId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Copy>(`/exams/${examId}/copies`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getCopies: async (examId: string) => {
    const response = await api.get<Copy[]>(`/exams/${examId}/copies`);
    return response.data;
  },

  getCopy: async (examId: string, copyId: string) => {
    const response = await api.get<Copy>(`/exams/${examId}/copies/${copyId}`);
    return response.data;
  },
};

// Correction API
export const correctionAPI = {
  correctCopy: async (examId: string, copyId: string) => {
    const response = await api.post<CorrectionResult>(`/exams/${examId}/copies/${copyId}/correct`);
    return response.data;
  },

  correctAllCopies: async (examId: string) => {
    const response = await api.post<CorrectionResult[]>(`/exams/${examId}/correct`);
    return response.data;
  },
};

// Results API
export const resultsAPI = {
  getGrade: async (examId: string, copyId: string) => {
    const response = await api.get<{ copyId: string; grade: number }>(`/exams/${examId}/copies/${copyId}/grade`);
    return response.data;
  },

  getReport: async (examId: string, type: 'summary' | 'detailed' = 'summary') => {
    const response = await api.get<{ examId: string; type: string; data: object }>(`/exams/${examId}/report`, {
      params: { type },
    });
    return response.data;
  },

  getAnnotations: async (examId: string, copyId: string) => {
    const response = await api.get<{ copyId: string; annotations: object }>(`/exams/${examId}/copies/${copyId}/annotations`);
    return response.data;
  },
};

// Chatbot/Rectification API
export const chatbotAPI = {
  requestRectification: async (examId: string, copyId: string, message: string) => {
    const response = await api.post<{ copyId: string; status: string; response: string }>(`/exams/${examId}/copies/${copyId}/rectify`, { message });
    return response.data;
  },

  flagIssue: async (examId: string, copyId: string, issue: string) => {
    const response = await api.post<{ copyId: string; flagged: boolean; issue: string }>(`/exams/${examId}/copies/${copyId}/flag`, { issue });
    return response.data;
  },
};

export default api;