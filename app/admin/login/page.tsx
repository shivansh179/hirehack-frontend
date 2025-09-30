"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { sendOtp, verifyOtp, verifyAdmin } from '../../services/apiService';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAdminAuth();

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
            // First verify OTP
            await verifyOtp(phoneNumber, otp);
            
            // Then verify admin access
            const response = await verifyAdmin();
            
            // If successful, login as admin
            login(phoneNumber, 'admin-token'); // Using a placeholder token for admin
            router.push('/admin/dashboard');
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError('Access denied. This is not an admin account.');
            } else {
                setError(err.response?.data?.message || 'Verification failed. Please try again.');
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

    return (
        <div className="flex min-h-screen items-center justify-center bg-dark-bg p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
                <form onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp} className="glass-pane p-8 rounded-lg space-y-4">
                    <h1 className="text-2xl font-bold text-center text-white">Admin Login</h1>
                    
                    {step === 'phone' ? (
                        <>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Admin Phone Number</label>
                                <input 
                                    id="phone" 
                                    type="tel" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    required 
                                    className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                    placeholder="e.g., +1234567890"
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800"
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
                                    required 
                                    className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
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
                                    className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify & Login'}
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
                </form>
            </motion.div>
        </div>
    );
}