'use client';

import { useState, FormEvent } from 'react';
import { registerUser } from '../services/apiService';

interface Props {
  onFormSubmit: (phoneNumber: string) => void;
}

export default function UserDetailsForm({ onFormSubmit }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      onFormSubmit(phoneNumber);
    } catch (err) {
      setError('Failed to register. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-700">Tell us about yourself</h2>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone Number</label>
        <input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
        <input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full text-black  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="profession" className="block text-sm font-medium text-gray-600">Profession (e.g., Software Engineer)</label>
        <input id="profession" type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="mt-1 block w-full px-3 py-2 text-black  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-600">Years of Experience</label>
        <input id="experience" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} className="mt-1 block w-full px-3 text-black  py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
        {isLoading ? 'Saving...' : 'Next'}
      </button>
    </form>
  );
}