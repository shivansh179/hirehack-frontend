import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [adminPhone, setAdminPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPhone = localStorage.getItem('adminPhoneNumber');
    if (storedPhone) {
      setAdminPhone(storedPhone);
    }
    setIsLoading(false);
  }, []);

  const login = (phone: string) => {
    localStorage.setItem('adminPhoneNumber', phone);
    setAdminPhone(phone);
  };

  const logout = () => {
    localStorage.removeItem('adminPhoneNumber');
    setAdminPhone(null);
  };

  return { adminPhone, login, logout, isLoading };
};