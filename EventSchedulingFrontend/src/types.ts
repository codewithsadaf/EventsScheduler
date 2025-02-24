export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  isRecurring: boolean;
  recurringDays?: string[];
}

export interface EventFormData {
  title: string;
  start: string;
  duration: number;
  isRecurring: boolean;
  recurringDays: string[];
}