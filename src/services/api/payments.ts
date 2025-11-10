// File: src/services/api/payments.ts

import { fetchWithAuth } from './helpers';

export const createCheckoutSession = async (cartItems: any[]) => {
  const response = await fetchWithAuth('/web/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ items: cartItems }),
  });
  return response;
};
