import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = (userData) => api.post("/users/signup", userData);
export const login = (userData) => api.post("/users/login", userData);

export const createFolder = (folderData) => api.post("/folders", folderData);
export const getFolders = () => api.get("/folders");

export const uploadImage = (formData) => api.post("/images", formData);
export const getImages = () => api.get("/images");
export const searchImages = (query) => api.get(`/images/search?query=${query}`);
export const getImagesByFolder = (folderId) =>
  api.get(`/images/folder/${folderId}`);
