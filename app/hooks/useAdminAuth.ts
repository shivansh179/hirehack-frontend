import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [adminPhone, setAdminPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken');
    const phone = localStorage.getItem('adminPhoneNumber');
    
    if (token && phone) {
      setAdminPhone(phone);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (phone: string, token: string) => {
    localStorage.setItem('adminAuthToken', token);
    localStorage.setItem('adminPhoneNumber', phone);
    setAdminPhone(phone);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminPhoneNumber');
    setAdminPhone(null);
    setIsAuthenticated(false);
  };

  return { adminPhone, isAuthenticated, login, logout, isLoading };
};