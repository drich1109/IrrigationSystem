import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { VITE_BASE_API, VITE_MAIN_API } from '@env';

const BASE_API_URL = VITE_BASE_API;
const MAIN_API_URL = VITE_MAIN_API;

const baseAxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mainAxiosInstance = axios.create({
  baseURL: MAIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

baseAxiosInstance.interceptors.request.use(
  (config) => {
    const token = ''; 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access for Base API
    }
    return Promise.reject(error);
  }
);

// Request and response interceptors for Main API
mainAxiosInstance.interceptors.request.use(
  (config) => {
    const token = ''; // Retrieve token for Main API
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

mainAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access for Main API
    }
    return Promise.reject(error);
  }
);

// Methods for Base API
export async function getFromBaseApi<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    const response = await baseAxiosInstance.get<T>(url, {
        ...config,
        params
    });
    return response.data;
}
  
  export async function postToBaseApi<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await baseAxiosInstance.post<T>(url, data, config);
    return response.data;
  }
  
  export async function putToBaseApi<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await baseAxiosInstance.put<T>(url, data, config);
    return response.data;
  }
  
  export async function putFormBaseApi<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const formConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': 'multipart/form-data',
        },
    };

    const response = await baseAxiosInstance.put<T>(url, formData, formConfig);
    return response.data;
}

  export async function deleteFromBaseApi<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await baseAxiosInstance.delete<T>(url, config);
    return response.data;
  }
  
  // Methods for Main API
  export async function getFromMainApi<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
      const response = await mainAxiosInstance.get<T>(url, {
        ...config,
        params
    });
    return response.data;
  }
  
  export async function postToMainApi<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await mainAxiosInstance.post<T>(url, data, config);
    return response.data;
  }
  
  export async function putToMainApi<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await mainAxiosInstance.put<T>(url, data, config);
    return response.data;
  }
  
  export async function deleteFromMainApi<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await mainAxiosInstance.delete<T>(url, config);
    return response.data;
  }

  export async function putFormMainApi<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const formConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': 'multipart/form-data',
        },
    };
    const response = await mainAxiosInstance.put<T>(url, formData, formConfig);
    return response.data;
}