"use client";

import { useState, useEffect } from 'react';
import { CodingChallenge, TestCaseResult, CodingSubmission } from '../types';
import { judge0Service, SupportedLanguage } from '../services/judge0Service';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Code,
  FileText,
  Settings,
  Download
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  challenge: CodingChallenge;
  challengeId: string;
  onSubmit: (submission: CodingSubmission) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string }[] = [
  { value: 'python', label: 'Python 3' },
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
];

const DEFAULT_CODE_TEMPLATES: Record<SupportedLanguage, string> = {
  python: `def solution(prices):
    # Your code here
    pass`,
  javascript: `function solution(prices) {
    // Your code here
}`,
  java: `public class Solution {
    public int solution(int[] prices) {
        // Your code here
        return 0;
    }
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int solution(vector<int>& prices) {
    // Your code here
    return 0;
}`,
  c: `#include <stdio.h>

int solution(int* prices, int pricesSize) {
    // Your code here
    return 0;
}`,
  csharp: `public class Solution {
    public int Solution(int[] prices) {
        // Your code here
        return 0;
    }
}`,
  go: `package main

func solution(prices []int) int {
    // Your code here
    return 0
}`,
  rust: `fn solution(prices: Vec<i32>) -> i32 {
    // Your code here
    0
}`,
  typescript: `function solution(prices: number[]): number {
    // Your code here
    return 0;
}`,
  ruby: `def solution(prices)
    # Your code here
    0
end`,
  php: `<?php
function solution($prices) {
    // Your code here
    return 0;
}`,
  swift: `func solution(_ prices: [Int]) -> Int {
    // Your code here
    return 0
}`,
  kotlin: `fun solution(prices: IntArray): Int {
    // Your code here
    return 0
}`,
};

export default function CodingChallengeInterface({ challenge, challengeId, onSubmit, onClose, isSubmitting = false }: Props) {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'code' | 'results'>('problem');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { isDarkMode } = useTheme();

  // Debug log to see what challenge data we're receiving
  console.log('CodingChallengeInterface received challenge:', challenge);

  useEffect(() => {
    setCode(DEFAULT_CODE_TEMPLATES[selectedLanguage]);
  }, [selectedLanguage]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert('Please write some code before running!');
      return;
    }

    setIsRunning(true);
    setShowResults(false);

    try {
      // For demo purposes, we'll create sample test cases
      // In a real implementation, these would come from the backend
      const testInputs = [
        '[7,1,5,3,6,4]',
        '[1,2,3,4,5]',
        '[7,6,4,3,1]',
        '[1,2]',
        '[2,1,2,0,1]'
      ];
      
      const expectedOutputs = [
        '7',
        '4',
        '0',
        '1',
        '2'
      ];

      const results = await judge0Service.submitCode(
        code,
        selectedLanguage,
        testInputs,
        expectedOutputs
      );

      setTestResults(results);
      setShowResults(true);
      setActiveTab('results');
    } catch (error) {
      console.error('Error running code:', error);
      alert('Error running code. Please check your syntax and try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    const submission: CodingSubmission = {
      code,
      language: selectedLanguage,
      challengeId,
      testResults,
      overallPassed: testResults.length > 0 && testResults.every(result => result.passed),
      submissionTime: Date.now() - startTime,
    };

    onSubmit(submission);
  };

  const getPassedTests = () => testResults.filter(result => result.passed).length;
  const getTotalTests = () => testResults.length;
  const getOverallResult = () => {
    if (testResults.length === 0) return 'pending';
    return testResults.every(result => result.passed) ? 'passed' : 'failed';
  };

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black bg-opacity-60' : 'bg-gray-200 bg-opacity-80'} flex items-center justify-center z-50 p-4`}>
      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Coding Challenge</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Technical Interview - Google</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
              {challenge.problem_name || 'Challenge'}
            </span>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              Close
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-6 py-4 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'problem'
                ? isDarkMode 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText className="h-4 w-4" />
            Problem Statement
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-6 py-4 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'code'
                ? isDarkMode 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Code className="h-4 w-4" />
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('results')}
              className={`px-6 py-4 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'results'
                  ? isDarkMode 
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900'
                    : 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <Settings className="h-4 w-4" />
            Test Results
            {testResults.length > 0 && (
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                getOverallResult() === 'passed' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {getPassedTests()}/{getTotalTests()}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'problem' && (
            <div className={`h-full overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="max-w-5xl">
                <div className="mb-8">
                  <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {challenge.problem_name || 'Coding Challenge'}
                  </h1>
                  <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                </div>
                <div className="prose prose-lg max-w-none prose-invert">
                  <p className={`leading-relaxed mb-8 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {String(challenge.problem || challenge.problem_description || challenge.problem_statement || 'No problem statement available')}
                  </p>
                </div>

                <div className={`rounded-xl p-6 mb-8 ${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                  <h4 className={`font-semibold mb-4 text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Example</h4>
                  <div className="space-y-4 text-sm">
                    {challenge.function_signature && (
                      <div>
                        <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Function Signature:</span>
                        <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                          isDarkMode 
                            ? 'bg-gray-800 text-green-400 border-gray-700' 
                            : 'bg-white text-green-700 border-gray-300'
                        }`}>
                          {String(challenge.function_signature)}
                        </code>
                      </div>
                    )}
                    {challenge.example && (
                      <>
                        <div>
                          <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Input:</span>
                        <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                          isDarkMode 
                            ? 'bg-gray-800 text-white border-gray-700' 
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}>
                          {String(challenge.example.input)}
                        </code>
                        </div>
                        <div>
                          <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Output:</span>
                          <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                            isDarkMode 
                              ? 'bg-gray-800 text-white border-gray-700' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}>
                            {String(challenge.example.output)}
                          </code>
                        </div>
                        {challenge.example.explanation && (
                          <div>
                            <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Explanation:</span>
                            <p className={`mt-1 p-4 rounded-lg border ${
                              isDarkMode 
                                ? 'text-gray-300 bg-gray-800 border-gray-700' 
                                : 'text-gray-700 bg-white border-gray-300'
                            }`}>{String(challenge.example.explanation)}</p>
                          </div>
                        )}
                      </>
                    )}
                    {challenge.example_input && (
                      <>
                        <div>
                          <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Example 1 Input:</span>
                          <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                            isDarkMode 
                              ? 'bg-gray-800 text-white border-gray-700' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}>
                            {String(JSON.stringify(challenge.example_input))}
                          </code>
                        </div>
                        <div>
                          <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Example 1 Output:</span>
                          <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                            isDarkMode 
                              ? 'bg-gray-800 text-white border-gray-700' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}>
                            {String(challenge.example_output)}
                          </code>
                        </div>
                      </>
                    )}
                    {challenge.example_input2 && (
                      <>
                        <div>
                          <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Example 2 Input:</span>
                          <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                            isDarkMode 
                              ? 'bg-gray-800 text-white border-gray-700' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}>
                            {String(JSON.stringify(challenge.example_input2))}
                          </code>
                        </div>
                        <div>
                          <span className={`font-medium block mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Example 2 Output:</span>
                          <code className={`block px-4 py-3 rounded-lg font-mono text-sm border ${
                            isDarkMode 
                              ? 'bg-gray-800 text-white border-gray-700' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}>
                            {String(challenge.example_output2)}
                          </code>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className={`border rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h4 className={`font-semibold mb-4 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Constraints</h4>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {Array.isArray(challenge.constraints) ? (
                        <ul className="space-y-2">
                          {challenge.constraints.map((constraint, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className={isDarkMode ? 'text-blue-400 mt-1' : 'text-blue-600 mt-1'}>•</span>
                              <span>{String(constraint)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="flex items-start gap-2">
                          <span className={isDarkMode ? 'text-blue-400 mt-1' : 'text-blue-600 mt-1'}>•</span>
                          <span>{String(challenge.constraints)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`border rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h4 className={`font-semibold mb-4 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {challenge.expected_time_complexity ? 'Complexity' : 'Format'}
                    </h4>
                    <div className={`text-sm space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {challenge.expected_time_complexity ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>⏱️</span>
                            <span>Time: <code className={`px-2 py-1 rounded ${isDarkMode ? 'text-green-400 bg-gray-900' : 'text-green-700 bg-green-50'}`}>{String(challenge.expected_time_complexity)}</code></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>💾</span>
                            <span>Space: <code className={`px-2 py-1 rounded ${isDarkMode ? 'text-green-400 bg-gray-900' : 'text-green-700 bg-green-50'}`}>{String(challenge.expected_space_complexity)}</code></span>
                          </div>
                        </>
                      ) : (
                        <>
                          {challenge.input_format && (
                            <div className="flex items-center gap-2">
                              <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>📥</span>
                              <span>Input: <code className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'text-green-400 bg-gray-900' : 'text-green-700 bg-green-50'}`}>{String(challenge.input_format)}</code></span>
                            </div>
                          )}
                          {challenge.output_format && (
                            <div className="flex items-center gap-2">
                              <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>📤</span>
                              <span>Output: <code className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'text-green-400 bg-gray-900' : 'text-green-700 bg-green-50'}`}>{String(challenge.output_format)}</code></span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {/* Language Selector */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-4">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Programming Language:
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                    className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 p-6">
                <div className={`h-full rounded-xl border overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-300'
                }`}>
                  <div className={`px-4 py-2 border-b ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>main.{selectedLanguage}</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Write your solution here..."
                    className={`w-full h-full p-6 font-mono text-sm focus:outline-none resize-none ${
                      isDarkMode 
                        ? 'bg-gray-800 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-400'
                    }`}
                    style={{ 
                      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                      lineHeight: '1.6'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>{selectedLanguage}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium ${
                        isRunning 
                          ? isDarkMode 
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Running Tests...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Run Tests
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!code.trim() || isRunning || isSubmitting}
                      className={`px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium ${
                        !code.trim() || isRunning || isSubmitting
                          ? isDarkMode 
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Checking Question...
                        </>
                      ) : (
                        'Submit Solution'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className={`h-full overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {!showResults ? (
                <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="text-center">
                    <div className={`p-4 rounded-full mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <Settings className={`h-12 w-12 mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Results Yet</h3>
                    <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run your code to see test results here</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-5xl">
                  {/* Summary */}
                  <div className="mb-8">
                    <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border-2 ${
                      getOverallResult() === 'passed' 
                        ? 'bg-green-900 border-green-600 text-green-300' 
                        : 'bg-red-900 border-red-600 text-red-300'
                    }`}>
                      {getOverallResult() === 'passed' ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                      <span className="font-semibold text-lg">
                        {getPassedTests()}/{getTotalTests()} test cases passed
                      </span>
                    </div>
                  </div>

                  {/* Test Results */}
                  <div className="space-y-6">
                    {testResults.map((result, index) => (
                      <div key={index} className={`border rounded-xl p-6 ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-800' 
                          : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Test Case {index + 1}
                          </h4>
                          <div className="flex items-center gap-3">
                            {result.passed ? (
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-400" />
                            )}
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                              result.passed 
                                ? 'bg-green-600 text-white' 
                                : 'bg-red-600 text-white'
                            }`}>
                              {result.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <div className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Input:</div>
                            <code className={`block p-4 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-900 text-white border-gray-600' 
                                : 'bg-gray-50 text-gray-900 border-gray-300'
                            }`}>
                              {result.input}
                            </code>
                          </div>
                          <div>
                            <div className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Expected Output:</div>
                            <code className={`block p-4 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-900 text-white border-gray-600' 
                                : 'bg-gray-50 text-gray-900 border-gray-300'
                            }`}>
                              {result.expectedOutput}
                            </code>
                          </div>
                          <div>
                            <div className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Your Output:</div>
                            <code className={`block p-4 rounded-lg border ${
                              result.passed 
                                ? isDarkMode
                                  ? 'bg-green-900 text-green-300 border-green-600' 
                                  : 'bg-green-50 text-green-700 border-green-300'
                                : isDarkMode
                                  ? 'bg-red-900 text-red-300 border-red-600'
                                  : 'bg-red-50 text-red-700 border-red-300'
                            }`}>
                              {result.actualOutput}
                            </code>
                          </div>
                          <div>
                            <div className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Performance:</div>
                            <div className={`p-4 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-900 border-gray-600' 
                                : 'bg-gray-50 border-gray-300'
                            }`}>
                              <div className={`text-xs space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <div className="flex items-center gap-2">
                                  <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>⏱️</span>
                                  <span>Time: {result.executionTime.toFixed(2)}ms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>💾</span>
                                  <span>Memory: {result.memoryUsage}KB</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
