export interface Interview {
  id: number;
  role: string;
  interviewType: string;
  status: string;
  createdAt: string;
  endedAt?: string;
  feedback?: string;
  interviewDurationMinutes: number;
  skills: string;
  user?: {
    id: number;
    fullName: string;
    phoneNumber: string;
  };
}

export interface Stats {
  totalUsers: number;
  totalInterviews: number;
  completedInterviews: number;
}



//judge0 types
export interface CodingChallenge {
  problem_name?: string;
  problem_statement?: string;
  problem_description?: string;
  problem?: string;
  input_format?: string;
  output_format?: string;
  expected_output?: string;
  function_signature?: string;
  constraints: string | string[];
  expected_time_complexity?: string;
  expected_space_complexity?: string;
  question_id?: number;
  example?: {
    input: string;
    output: string;
    explanation?: string;
  };
  example_input?: any;
  example_output?: any;
  example_input2?: any;
  example_output2?: any;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
  memoryUsage: number;
}

export interface CodingSubmission {
  code: string;
  language: string;
  challengeId: string;
  testResults: TestCaseResult[];
  overallPassed: boolean;
  submissionTime: number;
}
