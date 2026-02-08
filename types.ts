
import { LucideIcon } from 'lucide-react';

export enum ViewState {
  HOME = 'HOME',
  TIMETABLE = 'TIMETABLE',
  CHECK_IN = 'CHECK_IN',
  ENGAGEMENT = 'ENGAGEMENT',
  SETTINGS = 'SETTINGS',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  SEARCH = 'SEARCH',
  CAMPUS = 'CAMPUS',
  CHATBOT = 'CHATBOT',
  LIBRARY = 'LIBRARY',
  MAP = 'MAP',
  NETWORK_SEARCH = 'NETWORK_SEARCH'
}

export interface GridItem {
  id: string;
  label: string;
  icon: LucideIcon;
  targetView?: ViewState;
  externalUrl?: string;
  colorClass?: string;
}

export type AttendanceStatus = 'CHECKED_IN' | 'MISSED' | 'PENDING';

export interface TimetableEntry {
  id: string;
  module: string;
  type: string;
  time: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  location: string;
  lecturer: string;
  status: AttendanceStatus;
  date?: string; // YYYY-MM-DD
}

export interface CheckInSuccessData {
  xpGained: number;
  currentStreak: number;
}

// Gamification & Avatar Types
export type AvatarPartType = 'head' | 'accessory' | 'outfit';

export interface AvatarItem {
  id: string;
  name: string;
  type: AvatarPartType;
  cost: number;
  icon: string; // Emoji or asset URL
}

export interface AvatarConfig {
  head: string;
  accessory: string;
  outfit: string;
}
