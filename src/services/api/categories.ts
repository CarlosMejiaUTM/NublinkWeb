// File: src/services/api/categories.ts

import type { Category } from '../../types';

// 🔥 Importa directo desde .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};
