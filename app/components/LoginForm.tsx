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
  const [step, setStep] =useState <'phone' | 'otp' | 'register'>('phone');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10 && /^\d{10}$/.test(phone)) {
      return `+91${phone}`;
    }
    return String(phone);
  };

  const handleSendOtp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Phone number is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await sendOtp(formattedPhone);
      setStep('otp');
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        // @ts-ignore
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await verifyOtp(formattedPhone, otp);
      const { userExists, userDetails, token, refreshToken } = response.data;
      
      if (userExists && userDetails && token) {
        login(userDetails, token, refreshToken);
        router.push('/dashboard');
      } else {
        setStep('register');
      }
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        // @ts-ignore
        setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!fullName || !profession || !experience) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await registerUser({
        phoneNumber: formattedPhone,
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
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        // @ts-ignore
        setError((err as any).response?.data?.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
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
            <label htmlFor="phone" className="block text-sm font-medium text-black">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black placeholder-gray-500" 
              placeholder="e.g., 1234567890"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      ) : step === 'otp' ? (
        <>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-black">Enter OTP</label>
            <input 
              id="otp" 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-black placeholder-gray-500" 
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">OTP sent to {phoneNumber}</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={handleBackToPhone}
              className="w-full text-sm text-gray-600 hover:text-black"
            >
              Back to phone number
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-black">Complete Your Registration</h3>
            <p className="text-sm text-gray-600">OTP verified! Please provide your details.</p>
          </div>
          <div>
            <label htmlFor="name-login-reg" className="block text-sm font-medium text-black">Full Name</label>
            <input 
              id="name-login-reg" 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black text-black placeholder-gray-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="profession-login-reg" className="block text-sm font-medium text-black">Profession</label>
            <input 
              id="profession-login-reg" 
              type="text" 
              value={profession} 
              onChange={(e) => setProfession(e.target.value)} 
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black text-black placeholder-gray-500"
              placeholder="e.g., Software Developer"
            />
          </div>
          <div>
            <label htmlFor="experience-login-reg" className="block text-sm font-medium text-black">Years of Experience</label>
            <input 
              id="experience-login-reg" 
              type="number" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black text-black placeholder-gray-500"
              min="0"
              placeholder="Years"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
            <button 
              type="button" 
              onClick={handleBackToOtp}
              className="w-full text-sm text-gray-600 hover:text-black"
            >
              Back to OTP
            </button>
          </div>
        </>
      )}
    </form>
  );
}