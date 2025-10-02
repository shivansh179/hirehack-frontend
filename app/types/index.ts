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
