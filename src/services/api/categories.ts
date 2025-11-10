// File: src/services/api/categories.ts

import { API_BASE_URL } from './helpers';
import type { Category } from '../../types';

export const getCategories = async (): Promise<Category[]> => {
  const CATEGORIES_ENDPOINT = '/categories';
  const response = await fetch(`${API_BASE_URL}${CATEGORIES_ENDPOINT}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  return await response.json();
};
