const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005/api';

export const CATEGORIES_API = {
  GET_ALL: `${API_BASE_URL}/categories`,
  CREATE: `${API_BASE_URL}/categories`,
  UPDATE: (id) => `${API_BASE_URL}/categories/${id}`,
  DELETE: (id) => `${API_BASE_URL}/categories/${id}`,
};
