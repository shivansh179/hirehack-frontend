"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
// CORRECTED: Importing the new function
import { uploadResume, startEnhancedInterview, fetchInterviewConfiguration } from '../services/apiService';
import { useRouter } from 'next/navigation';
import { XMarkIcon, DocumentArrowUpIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface Props {
  phoneNumber: string;
  onClose: () => void;
}

interface InterviewConfiguration {
    focusAreas: string[];
    personas: string[];
    companies: string[];
}

const durationOptions = [5, 10, 15, 20, 30, 45, 60];

export default function InterviewSetupModal({ onClose, phoneNumber }: Props) {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedInterviewType, setSelectedInterviewType] = useState<string>('');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [duration, setDuration] = useState(durationOptions[4]); // Default to 30 mins
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [interviewConfig, setInterviewConfig] = useState<InterviewConfiguration>({ focusAreas: [], personas: [], companies: [] });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const getConfig = async () => {
            setIsLoading(true);
            try {
                const response = await fetchInterviewConfiguration();
                setInterviewConfig(response.data);
                if (response.data.personas.length > 0) setSelectedInterviewType(response.data.personas[0]);
                if (response.data.companies.length > 0) setSelectedCompany(response.data.companies[0]);
            } catch (err) {
                console.error("Failed to fetch interview configuration:", err);
                setError('Could not load interview settings. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        getConfig();
    }, []);

    const handleNextStep = () => {
        if (step === 1 && (!role.trim() || selectedSkills.length === 0 || !selectedInterviewType || !selectedCompany)) {
            setError('Please complete all fields to proceed.');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) setResumeFile(e.target.files[0]);
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
            await uploadResume(formData);
            setStep(3);
        } catch (err) {
            setError('Failed to upload resume. Please try again or skip.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- START: CORRECTED FUNCTION TO BUILD AND SEND THE NEW PAYLOAD ---
    const handleStartInterview = async () => {
        if (selectedSkills.length === 0) {
            setError("Please select at least one skill to focus on.");
            return;
        }

        setIsLoading(true);
        setError('');

        // Dynamically create the focusAreas payload with weighted percentages
        const numSkills = selectedSkills.length;
        const baseWeight = Math.floor(100 / numSkills);
        const remainder = 100 % numSkills;

        const focusAreasPayload = selectedSkills.map((skill, index) => {
            const weight = baseWeight + (index < remainder ? 1 : 0);
            return {
                areaName: skill,
                weightPercentage: weight,
            };
        });

        try {
            // Call the new, correct API function
            const response = await startEnhancedInterview({
                role: role,
                focusAreas: focusAreasPayload,
                durationMinutes: duration,
                interviewerPersona: selectedInterviewType,
                company: selectedCompany,
            });

            const { interviewId, initialQuestion, currentQuestionId } = response.data;
            localStorage.setItem(`interview_${interviewId}_question`, initialQuestion);
            
            // Store the interview data including currentQuestionId
            const interviewData = {
                currentQuestionId: currentQuestionId || null
            };
            localStorage.setItem(`interview_${interviewId}_data`, JSON.stringify(interviewData));
            
            router.push(`/interview/${interviewId}`);
        } catch (err) {
            console.error("Error starting interview:", err);
            setError('Could not start the interview. Please check backend logs.');
            setIsLoading(false);
        }
    };
    // --- END: CORRECTED FUNCTION ---

    const handleSkillToggle = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const commonInputStyles = "w-full bg-black text-white border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-white focus:border-white transition-colors placeholder-gray-500";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-black border border-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg relative text-gray-200"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Interview Setup</h2>
                            <p className="text-gray-400 text-sm mt-1">Configure your practice session.</p>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-2">Target Role</label>
                            <input id="role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Senior Software Engineer" className={commonInputStyles}/>
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-2">Target Company</label>
                            <select id="company" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className={commonInputStyles}>
                                {interviewConfig.companies.map(company => (
                                    <option key={company} value={company} className="bg-black text-white">{company}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Key Skills (Click to select/deselect)</label>
                             <div className="flex flex-wrap gap-2 p-2 border border-gray-800 rounded-md max-h-56 overflow-y-auto bg-gray-900/50">
                                {interviewConfig.focusAreas.map(skill => (
                                    <button key={skill} onClick={() => handleSkillToggle(skill)} className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all duration-200 border ${selectedSkills.includes(skill) ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600 hover:border-white hover:text-white'}`}>
                                        {skill}
                                    </button>
                                ))}
                            </div>
                             {selectedSkills.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">Selected: {selectedSkills.slice(0, 5).join(', ')}{selectedSkills.length > 5 ? ` and ${selectedSkills.length - 5} more` : ''}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="interviewType" className="block text-sm font-medium text-gray-400 mb-2">Interviewer Persona</label>
                            <select id="interviewType" value={selectedInterviewType} onChange={(e) => setSelectedInterviewType(e.target.value)} className={commonInputStyles}>
                                {interviewConfig.personas.map(persona => (
                                    <option key={persona} value={persona} className="bg-black text-white">{persona}</option>
                                ))}
                            </select>
                        </div>
                        
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        <button onClick={handleNextStep} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">
                            Next <ArrowRightIcon className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                     <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Upload Resume</h2>
                            <p className="text-gray-400 text-sm mt-1">(Optional) For a personalized experience.</p>
                        </div>
                        <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-700 rounded-lg p-10 text-center cursor-pointer hover:border-white hover:bg-gray-900/50 transition-all">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                            <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-600" />
                            <p className="mt-2 text-gray-400">Drag & drop or click to upload</p>
                            {resumeFile && <p className="mt-2 text-sm text-green-400 font-semibold">{resumeFile.name}</p>}
                        </div>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                         <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 px-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">Back</button>
                            <button onClick={handleResumeUploadAndContinue} disabled={isLoading} className="flex-1 py-3 px-4 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">
                                {isLoading ? 'Uploading...' : resumeFile ? 'Continue' : 'Skip'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
                        <h2 className="text-2xl font-bold text-white">Final Step</h2>
                        <p className="text-gray-400">Select the interview duration to begin.</p>
                         <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3">Interview Duration</label>
                            <div className="flex justify-center flex-wrap gap-3">
                                {durationOptions.map(d => (
                                    <button key={d} onClick={() => setDuration(d)} className={`px-5 py-2 w-24 rounded-md font-semibold transition-colors text-sm border ${duration === d ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600 hover:border-white'}`}>
                                        {d} min
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button onClick={handleStartInterview} disabled={isLoading} className="w-full py-3 px-4 bg-green-500 text-black font-bold rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Preparing Session...' : 'Start Interview'}
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}