"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { sendOtp, verifyOtp, registerUser } from '../services/apiService';

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Phone number is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      await sendOtp(phoneNumber);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await verifyOtp(phoneNumber, otp);
      const { userExists, userDetails, token, refreshToken } = response.data;
      
      if (userExists && userDetails && token) {
        // User exists and is logged in
        login(userDetails, token, refreshToken);
        router.push('/dashboard');
      } else {
        // User doesn't exist, need to complete registration
        setStep('register');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !profession || !experience) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await registerUser({
        phoneNumber,
        fullName,
        profession,
        yearsOfExperience: parseInt(experience),
      });

      const { token, refreshToken, phoneNumber: userPhone, fullName: userName } = response.data;
      
      login({
        phoneNumber: userPhone,
        fullName: userName,
        profession,
        yearsOfExperience: parseInt(experience)
      }, token, refreshToken);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  const handleBackToOtp = () => {
    setStep('otp');
    setError('');
  };

  return (
    <form onSubmit={
      step === 'phone' ? handleSendOtp : 
      step === 'otp' ? handleVerifyOtp : 
      handleRegister
    } className="space-y-4">
      {step === 'phone' ? (
        <>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              placeholder="e.g., +1234567890"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300">Enter OTP</label>
            <input 
              id="otp" 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            <p className="text-xs text-gray-400 mt-1">OTP sent to {phoneNumber}</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={handleBackToPhone}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              Back to phone number
            </button>
          </div>
        </>
      )}

      {step === 'register' && (
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-white">Complete Your Registration</h3>
            <p className="text-sm text-gray-400">OTP verified! Please provide your details.</p>
          </div>
          <div>
            <label htmlFor="name-login-reg" className="block text-sm font-medium text-gray-300">Full Name</label>
            <input 
              id="name-login-reg" 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary text-white"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="profession-login-reg" className="block text-sm font-medium text-gray-300">Profession</label>
            <input 
              id="profession-login-reg" 
              type="text" 
              value={profession} 
              onChange={(e) => setProfession(e.target.value)} 
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary text-white"
              placeholder="e.g., Software Developer"
            />
          </div>
          <div>
            <label htmlFor="experience-login-reg" className="block text-sm font-medium text-gray-300">Years of Experience</label>
            <input 
              id="experience-login-reg" 
              type="number" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary text-white"
              min="0"
              placeholder="Years"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
            <button 
              type="button" 
              onClick={handleBackToOtp}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              Back to OTP
            </button>
          </div>
        </>
      )}
    </form>
  );
}