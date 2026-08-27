import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/notes`;

export const getNotes = async () => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data;
};

export const getNote = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const createNote = async (noteData) => {
  const response = await axios.post(API_URL, noteData, {
    withCredentials: true,
  });

  return response.data;
};

export const updateNote = async (id, noteData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, noteData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to update note", { cause: error });
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to delete note", { cause: error });
  }
};