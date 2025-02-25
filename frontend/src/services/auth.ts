import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosRequestHeaders,
  } from "axios";
  import { redirect } from "@tanstack/react-router";
  
  interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_id: number;
    username: string;
    email: string;
  }
  
  interface LoginCredentials {
    username: string;
    password: string;
  }
  
  interface RegisterCredentials extends LoginCredentials {
    email: string;
  }
  
  const API_BASE_URL = "http://127.0.0.1:8000";
  
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getStoredToken = () => localStorage.getItem("token");
  const getStoredRefreshToken = () => localStorage.getItem("refresh_token");
  
  export const storeAuthData = (authResponse: AuthResponse) => {
    console.log("Storing auth data:", authResponse);
    localStorage.setItem("user_id", String(authResponse.user_id));
    localStorage.setItem("token", authResponse.access_token);
    localStorage.setItem("username", authResponse.username);
    localStorage.setItem("email", authResponse.email);
    localStorage.setItem("refresh_token", authResponse.refresh_token);
  };
  
  export const clearAuthData = () => {
    console.log("Clearing auth data");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    sessionStorage.removeItem("currentPath")
    sessionStorage.removeItem("pathHistory")
  };
  
  const refreshToken = async () => {
    const refresh_token = getStoredRefreshToken();
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }
  
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/refresh/`,
        { refresh_token }
      );
      storeAuthData(response.data);
      return response.data.access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearAuthData();
      throw redirect({ to: "/login" });
    }
  };
  
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const originalRequest = error.config;
        if (!originalRequest) {
          return Promise.reject(error);
        }
        try {
          const newToken = await refreshToken();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          } as AxiosRequestHeaders;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  
  export const register = async (credentials: RegisterCredentials) => {
    const response = await api.post<{ message: string }>("/register/", credentials);
    return response.data;
  };
  
  export const login = async (credentials: LoginCredentials) => {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
  
    try {
      const response = await api.post<AuthResponse>("/token/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      storeAuthData(response.data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          throw new Error(err.response.data?.detail || "Invalid username or password");
        } else if (err.request) {
          throw new Error("No response from server. Check your connection.");
        }
      } else {
        throw new Error("An unexpected error occurred. Please try again later.");
      }
    }
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getStoredToken();
  };
  
export default api;