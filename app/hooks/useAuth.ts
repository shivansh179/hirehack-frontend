import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPhone = localStorage.getItem('userPhoneNumber');
    if (storedPhone) {
      setPhoneNumber(storedPhone);
    }
    setIsLoading(false);
  }, []);

  const login = (phone: string) => {
    localStorage.setItem('userPhoneNumber', phone);
    setPhoneNumber(phone);
  };

  const logout = () => {
    localStorage.removeItem('userPhoneNumber');
    setPhoneNumber(null);
  };

  return { phoneNumber, login, logout, isLoading };
};