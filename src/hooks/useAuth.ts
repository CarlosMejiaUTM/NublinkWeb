// FileName: useAuth.ts
// Path: src/hooks/useAuth.ts

import { useEffect, useState } from 'react';

interface AuthUser {
  name: string | null;
  email: string | null;
  role: string | null;
  storeId: string | null;
  storeStatus: string | null;
  token: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      return;
    }

    const storedUser: AuthUser = {
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
      storeId: localStorage.getItem('storeId'),
      storeStatus: localStorage.getItem('storeStatus'),
      token,
    };

    setUser(storedUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('storeId');
    localStorage.removeItem('storeStatus');
    setUser(null);
  };

  return { user, logout };
};
