export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'student';
  isBlocked: boolean;
  freeTestUsed: boolean;
  testAttempts: number;
  maxTestAttempts: number; // -1 means unlimited
  allowedDirections: string[]; // Direction IDs user has access to
  createdAt: string;
  profileImage?: string;
  bio?: string;
  achievements: Achievement[];
  totalScore: number;
  rank: number;
}

export interface Direction {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isFree: boolean;
  price: number;
  testWindow?: {
    startDate: string;
    endDate: string;
  };
  subjects: Subject[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  type: 'main' | 'mandatory';
  questionCount: number;
  pointsPerQuestion: number;
  directionId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  subjectId: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  wrongAnswerCount: number; // For analytics
}

export interface TestSession {
  id: string;
  userId: string;
  directionId: string;
  startTime: string;
  endTime?: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  isPaid: boolean;
  timeLeft: number; // in seconds
  cheatingFlags: CheatingFlag[];
  ipAddress: string;
}

export interface CheatingFlag {
  type: 'tab_switch' | 'window_blur' | 'copy_paste' | 'right_click';
  timestamp: string;
  count: number;
}

export interface TestResult {
  id: string;
  testSessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  directionId: string;
  direction: string;
  totalScore: number;
  subjectScores: Record<string, { score: number; correct: number; total: number }>;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number; // in seconds
  rank?: number;
  percentile?: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  directionId: string;
  directionName: string;
  createdAt: string;
  paymentMethod?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'score' | 'streak' | 'first' | 'subject_master';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'test_available' | 'result_ready' | 'achievement' | 'warning' | 'info';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalTests: number;
  averageScore: number;
  popularDirections: { directionId: string; count: number }[];
  difficultQuestions: { questionId: string; wrongCount: number }[];
  userActivity: { date: string; count: number }[];
}