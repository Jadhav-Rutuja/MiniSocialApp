import axios from "axios";

const API = axios.create({ baseURL: "https://minisocialapp-4prn.onrender.com/api" });

// --- Auth ---
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (email, password) => API.post("/auth/login", { email, password });
export const getCurrentUser = (token) => API.get("/auth/me", { headers: { Authorization: token } });
export const updateCurrentUser = (data, token) => API.put("/auth/me", data, { headers: { Authorization: token } });

// --- Posts ---
export const getAllPosts = (token, page = 1) => API.get(`/posts?page=${page}`, { headers: { Authorization: token } });
export const getUserPosts = (userId, token) => API.get(`/posts/user/${userId}`, { headers: { Authorization: token } });
export const createPost = (data, token) => API.post("/posts", data, { headers: { Authorization: token } });
export const editPost = (postId, data, token) => API.put(`/posts/${postId}`, data, { headers: { Authorization: token } });
export const deletePost = (postId, token) => API.delete(`/posts/${postId}`, { headers: { Authorization: token } });
export const likePost = (postId, token) => API.put(`/posts/like/${postId}`, {}, { headers: { Authorization: token } });
export const commentPost = (postId, data, token) => API.put(`/posts/comment/${postId}`, data, { headers: { Authorization: token } });
export const toggleSavePost = (postId, token) => API.put(`/posts/save/${postId}`, {}, { headers: { Authorization: token } });

// --- Users ---
export const followUser = (userId, token) => API.put(`/users/follow/${userId}`, {}, { headers: { Authorization: token } });
export const unfollowUser = (userId, token) => API.put(`/users/unfollow/${userId}`, {}, { headers: { Authorization: token } });

// --- Notifications (optional) ---
export const getNotifications = (token) => API.get("/notifications", { headers: { Authorization: token } });

export default API;





