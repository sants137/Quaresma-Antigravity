export type QuizStep = 'intro' | 'name' | 'assessment' | 'routine' | 'intention' | 'audio_message' | 'transition';

export interface UserData {
  name: string;
  assessment: string;
  routine: string;
  intention: string;
}

export interface QuizProps {
  onComplete: (name: string) => void;
  onDashboardRequest: () => void;
}

export interface SalesPageProps {
  userName: string;
}

export interface DailyMetric {
  date: string;
  visits: number;
  interactions: number;
  steps: Record<string, number>;
  salesPageViews: number;
  checkouts: number;
}

export interface DashboardProps {
  onBack: () => void;
}

export interface AnalyticsEvent {
  id?: string;
  created_at?: string;
  event_type: 'visit' | 'interaction' | 'step' | 'sales_view' | 'checkout';
  step_name?: string;
  metadata?: any;
}