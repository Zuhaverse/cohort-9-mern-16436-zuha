import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData, {
    withCredentials: true,
  });

  return response.data;
};

export const verifySession = async () => {
  const response = await axios.get(`${API_URL}/me`, {
    withCredentials: true,
  });

  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};