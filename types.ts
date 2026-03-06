
export type TaskStatus = 'Pending' | 'Done';

export interface DailyTask {
  id: string;
  date: string;
  time: string;
  category: string;
  title: string;
  notes: string;
  status: TaskStatus;
  proofImage?: string;
  createdAt: number;
}

export interface Metric {
  label: string;
  value: string;
  id: string;
}

export interface SocialMediaData {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'Web';
  date: string;
  metrics: Metric[];
  customContext?: string;
  analysis?: string;
  recommendations?: string[];
  createdAt: number;
}

export interface AppState {
  tasks: DailyTask[];
  avatar: string;
  userName: string;
  socialReports: SocialMediaData[];
}

export type ReportType = 'Full' | 'Summary';
