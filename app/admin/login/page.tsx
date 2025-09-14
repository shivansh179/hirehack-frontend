"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { verifyAdmin } from '../../services/apiService';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAdminAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await verifyAdmin(phoneNumber);
            login(phoneNumber);
            router.push('/admin/dashboard');
        } catch (err) {
            setError('Verification failed. Not an admin account.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-dark-bg p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="glass-pane p-8 rounded-lg space-y-4">
                    <h1 className="text-2xl font-bold text-center text-white">Admin Login</h1>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Admin Phone Number</label>
                        <input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800">
                        {isLoading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}