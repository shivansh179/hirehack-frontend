"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { checkUserExists } from '../services/apiService';

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Phone number is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await checkUserExists(phoneNumber);
      if (response.data.exists) {
        login(phoneNumber);
        router.push('/dashboard');
      } else {
        setError('No account found with this number. Please sign up.');
      }
    } catch (err) {
      setError('Failed to log in. Please check the number and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
        <input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., +1234567890"/>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400 disabled:cursor-not-allowed">
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}