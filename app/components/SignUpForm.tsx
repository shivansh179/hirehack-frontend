"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

export default function SignUpForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !fullName || !profession || !experience) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      await registerUser({
        phoneNumber,
        fullName,
        profession,
        yearsOfExperience: parseInt(experience),
      });
      login(phoneNumber);
      router.push('/dashboard');
    } catch (err) {
      setError('This phone number may already be registered. Please sign in.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label htmlFor="phone-signup" className="block text-sm font-medium text-gray-300">Phone Number</label>
        <input id="phone-signup" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
      </div>
      <div>
        <label htmlFor="name-signup" className="block text-sm font-medium text-gray-300">Full Name</label>
        <input id="name-signup" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
      </div>
      <div>
        <label htmlFor="profession-signup" className="block text-sm font-medium text-gray-300">Profession</label>
        <input id="profession-signup" type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
      </div>
      <div>
        <label htmlFor="experience-signup" className="block text-sm font-medium text-gray-300">Years of Experience</label>
        <input id="experience-signup" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400">
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}