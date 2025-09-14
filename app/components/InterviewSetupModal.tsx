"use client";

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadResume, startInterview } from '../services/apiService';
import { useRouter } from 'next/navigation';
import { XMarkIcon, DocumentArrowUpIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface Props {
  phoneNumber: string;
  onClose: () => void;
}

const interviewTypes = ["Behavioral", "Technical", "Mixed"];
const durationOptions = [5, 10, 15, 20];

export default function InterviewSetupModal({ onClose, phoneNumber }: Props) {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('');
    const [skills, setSkills] = useState('');
    const [interviewType, setInterviewType] = useState(interviewTypes[0]);
    const [duration, setDuration] = useState(durationOptions[1]);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleNextStep = () => {
        if (step === 1 && (!role.trim() || !skills.trim())) {
            setError('Please fill out both the role and skills.');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setResumeFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleResumeUploadAndContinue = async () => {
        if (!resumeFile) {
            setStep(3);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', resumeFile);
            formData.append('phoneNumber', phoneNumber);
            await uploadResume(formData);
            setStep(3);
        } catch (err) {
            setError('Failed to upload resume. Please try again or skip.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartInterview = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await startInterview({
                phoneNumber,
                interviewDurationMinutes: duration,
                role,
                skills,
                interviewType,
            });
            const { interviewId, initialQuestion } = response.data;
            localStorage.setItem(`interview_${interviewId}_question`, initialQuestion);
            router.push(`/interview/${interviewId}`);
        } catch (err) {
            setError('Could not start the interview. Please check backend logs.');
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-pane p-8 rounded-2xl w-full max-w-lg relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Setup Your Interview</h2>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Target Role</label>
                            <input id="role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Senior Software Engineer" className="w-full bg-gray-700 text-white border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">Key Skills</label>
                            <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, Node.js, AWS" className="w-full bg-gray-700 text-white border-gray-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Interview Type</label>
                            <div className="flex gap-3">
                                {interviewTypes.map(type => (
                                    <button key={type} onClick={() => setInterviewType(type)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${interviewType === type ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <button onClick={handleNextStep} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                            Next <ArrowRightIcon className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
                
                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Upload Your Resume</h2>
                        <div 
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors"
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                            <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="mt-2 text-gray-300">Drag & drop your PDF here, or click to select</p>
                            {resumeFile && <p className="mt-2 text-sm text-green-400 font-semibold">{resumeFile.name}</p>}
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                         <div className="flex gap-4">
                            <button onClick={handleResumeUploadAndContinue} disabled={isLoading} className="flex-1 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 transition-colors">
                                {isLoading ? 'Uploading...' : resumeFile ? 'Upload & Continue' : 'Skip & Continue'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                        <h2 className="text-2xl font-bold text-white">Final Step</h2>
                        <p className="text-gray-400">Confirm the interview duration and you're all set.</p>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Interview Duration</label>
                            <div className="flex justify-center gap-3">
                                {durationOptions.map(d => (
                                    <button key={d} onClick={() => setDuration(d)} className={`px-5 py-2 rounded-lg font-semibold transition-colors ${duration === d ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                        {d} min
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <button onClick={handleStartInterview} disabled={isLoading} className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-green-800">
                            {isLoading ? 'Preparing Session...' : 'Start Interview'}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}