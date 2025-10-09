import { TestCaseResult } from '../types';

interface Judge0Submission {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output?: string;
}

interface Judge0Result {
  token: string;
  status?: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: string;
  memory?: number;
}

// Judge0 language IDs for common languages (updated with latest versions)
export const LANGUAGE_IDS = {
  python: 109,     // Python 3.13.2 (latest)
  javascript: 102, // Node.js 22.08.0 (latest)
  java: 91,        // Java (JDK 17.0.6)
  cpp: 105,        // C++ (GCC 14.1.0)
  c: 103,          // C (GCC 14.1.0)
  csharp: 51,      // C# (Mono 6.6.0.161)
  go: 107,         // Go 1.23.5 (latest)
  rust: 108,       // Rust 1.85.0 (latest)
  php: 98,         // PHP 8.3.11 (latest)
  ruby: 72,        // Ruby 2.7.0
  swift: 83,       // Swift 5.2.3
  kotlin: 111,     // Kotlin 2.1.10 (latest)
  typescript: 101, // TypeScript 5.6.2 (latest)
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_IDS;

class Judge0Service {
  private baseUrl: string;
  private rapidApiKey: string;

  constructor() {
    this.baseUrl = 'https://judge0-ce.p.rapidapi.com';
    this.rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async submitCode(
    code: string,
    language: SupportedLanguage,
    testInputs: string[],
    expectedOutputs: string[]
  ): Promise<TestCaseResult[]> {
    const results: TestCaseResult[] = [];

    for (let i = 0; i < testInputs.length; i++) {
      const submission: Judge0Submission = {
        language_id: LANGUAGE_IDS[language],
        source_code: code,
        stdin: testInputs[i],
        expected_output: expectedOutputs[i],
      };

      try {
        // Submit code for execution
        const submissionResponse = await this.makeRequest('/submissions', {
          method: 'POST',
          body: JSON.stringify(submission),
        });

        const token = submissionResponse.token;
        
        // Poll for results
        const result = await this.pollForResult(token);
        
        // Process the result
        const testResult: TestCaseResult = {
          input: testInputs[i],
          expectedOutput: expectedOutputs[i],
          actualOutput: this.processOutput(result.stdout || ''),
          passed: this.compareOutputs(
            this.processOutput(result.stdout || ''),
            expectedOutputs[i]
          ),
          executionTime: parseFloat(result.time || '0') * 1000, // Convert to milliseconds
          memoryUsage: result.memory || 0,
        };

        results.push(testResult);
      } catch (error) {
        console.error(`Error executing test case ${i + 1}:`, error);
        results.push({
          input: testInputs[i],
          expectedOutput: expectedOutputs[i],
          actualOutput: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          passed: false,
          executionTime: 0,
          memoryUsage: 0,
        });
      }
    }

    return results;
  }

  private async pollForResult(token: string, maxAttempts = 30): Promise<Judge0Result> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.makeRequest(`/submissions/${token}`);
      
      if (result.status && result.status.id <= 2) {
        // Status 1: In Queue, Status 2: Processing
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        continue;
      }
      
      return result;
    }
    
    throw new Error('Timeout waiting for code execution result');
  }

  private processOutput(output: string): string {
    return output.trim().replace(/\r\n/g, '\n');
  }

  private compareOutputs(actual: string, expected: string): boolean {
    const normalizedActual = actual.trim().toLowerCase();
    const normalizedExpected = expected.trim().toLowerCase();
    return normalizedActual === normalizedExpected;
  }

  async getAvailableLanguages(): Promise<SupportedLanguage[]> {
    return Object.keys(LANGUAGE_IDS) as SupportedLanguage[];
  }

  async validateCode(code: string, language: SupportedLanguage): Promise<boolean> {
    if (!code.trim()) return false;
    
    try {
      // Basic validation - check if code is not empty and language is supported
      return code.trim().length > 0 && language in LANGUAGE_IDS;
    } catch {
      return false;
    }
  }
}

export const judge0Service = new Judge0Service();
