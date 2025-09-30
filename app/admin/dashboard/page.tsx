"use client";

import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import { getAdminStats, getAllInterviews } from '../../services/apiService';
import { motion } from 'framer-motion';
import { UserGroupIcon, BriefcaseIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';


const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) => (
    <motion.div whileHover={{ scale: 1.05 }} className="glass-pane p-6 rounded-lg flex items-center gap-4">
        <div className="bg-primary/20 p-3 rounded-lg">{icon}</div>
        <div>
            <p className="text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

interface Stats {
    totalUsers: number;
    totalInterviews: number;
    completedInterviews: number;
}

interface Interview {
    id: number;
    role: string;
    interviewType: string;
    status: string;
    createdAt: string;
    endedAt?: string;
    feedback?: string;
    interviewDurationMinutes: number;
    skills: string;
    user: {
        id: number;
        fullName: string;
        phoneNumber: string;
    };
}

export default function AdminDashboard() {
    const { adminPhone, isLoading, logout } = useAdminAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);

    useEffect(() => {
        if (!isLoading && !adminPhone) router.replace('/admin/login');
        if (adminPhone) {
            getAdminStats().then(res => setStats(res.data));
            getAllInterviews().then(res => setRecentInterviews(res.data.slice(0, 5)));
        }
    }, [adminPhone, isLoading, router]);
    
    if (isLoading || !stats) return <div className="text-center p-10">Loading Admin Dashboard...</div>;

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={() => { logout(); router.push('/admin/login'); }}>Logout</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard icon={<UserGroupIcon className="h-8 w-8 text-primary" />} title="Total Users" value={stats.totalUsers} />
                <StatCard icon={<BriefcaseIcon className="h-8 w-8 text-primary" />} title="Total Interviews" value={stats.totalInterviews} />
                <StatCard icon={<CheckBadgeIcon className="h-8 w-8 text-primary" />} title="Completed" value={stats.completedInterviews} />
            </div>

            <h2 className="text-2xl font-bold mb-4">Recent Interviews</h2>
            <div className="glass-pane rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentInterviews.map(interview => (
                            <tr key={interview.id} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                                <td className="p-4">{interview.user?.fullName || 'Unknown'}</td>
                                <td className="p-4">{interview.role}</td>
                                <td className="p-4 text-gray-400">{new Date(interview.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}