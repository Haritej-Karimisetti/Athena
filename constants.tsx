
import {
  CheckSquare,
  Mail,
  MonitorPlay,
  Tent,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Briefcase,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Users,
  Library,
  Map,
  Sparkles,
  Globe
} from 'lucide-react';
import { GridItem, ViewState, TimetableEntry, AvatarItem } from './types';

export const GRID_ITEMS: GridItem[] = [
  { id: 'checkin', label: 'Check in', icon: CheckSquare, targetView: ViewState.CHECK_IN, colorClass: 'bg-leeds-green' },
  { id: 'netsearch', label: 'Net Search', icon: Globe, targetView: ViewState.NETWORK_SEARCH, colorClass: 'bg-orange-500' },
  { id: 'agent', label: 'Athena AI', icon: Sparkles, targetView: ViewState.CHATBOT, colorClass: 'bg-leeds-blue' },
  { id: 'engagement', label: 'My Engagement', icon: Activity, targetView: ViewState.ENGAGEMENT, colorClass: 'bg-amber-500' },
  { id: 'library', label: 'Library Hub', icon: Library, externalUrl: 'https://library.leeds.ac.uk/', colorClass: 'bg-indigo-500' },
  { id: 'map', label: 'Campus Map', icon: Map, targetView: ViewState.MAP, colorClass: 'bg-red-500' },
  { id: 'campus', label: 'Campus life', icon: Tent, externalUrl: 'https://www.leeds.ac.uk/undergraduate-offer/doc/campus-life', colorClass: 'bg-lime-600' },
  { id: 'minerva', label: 'Minerva', icon: MonitorPlay, externalUrl: 'https://minerva.leeds.ac.uk/ultra/institution-page', colorClass: 'bg-purple-500' },
  { id: 'email', label: 'Email', icon: Mail, externalUrl: 'https://outlook.office.com/mail/inbox/', colorClass: 'bg-cyan-500' },
  { id: 'help', label: 'Getting help', icon: HeartHandshake, externalUrl: 'https://students.leeds.ac.uk/support-guidance/doc/student-information-service', colorClass: 'bg-pink-500' },
  { id: 'it', label: 'IT support', icon: HelpCircle, externalUrl: 'https://it.leeds.ac.uk/it', colorClass: 'bg-slate-500' },
  { id: 'careers', label: 'Careers', icon: Briefcase, externalUrl: 'https://students.leeds.ac.uk/careers', colorClass: 'bg-rose-500' },
  { id: 'harassment', label: 'Harassment', icon: ShieldAlert, externalUrl: 'https://students.leeds.ac.uk/harassment-misconduct', colorClass: 'bg-orange-600' },
  { id: 'violence', label: 'Sexual Violence', icon: AlertTriangle, externalUrl: 'https://students.leeds.ac.uk/harassment-misconduct/doc/sexual-violence-information', colorClass: 'bg-fuchsia-600' },
];

export const MOCK_TIMETABLE: TimetableEntry[] = [
  { id: 'm1', module: 'COMP5840M01 - Advanced Software Engineering', type: 'Lecture', time: '10:00 - 11:00', startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, dayOfWeek: 1, location: 'Roger Stevens LT 20', lecturer: 'Dr. Sarah Wilson', status: 'PENDING', date: '2026-03-09' },
  { id: 't1', module: 'MATH5747M01 - Financial Mathematics', type: 'Lecture', time: '16:00 - 18:00', startHour: 16, startMinute: 0, endHour: 18, endMinute: 0, dayOfWeek: 2, location: 'Chemistry West Block LT E', lecturer: 'Prof. David Miller', status: 'PENDING', date: '2026-03-10' },
  { id: 'w1', module: 'GEOG5917M01 - GIS & Environmental Data', type: 'Lecture', time: '09:00 - 11:00', startHour: 9, startMinute: 0, endHour: 11, endMinute: 0, dayOfWeek: 3, location: 'Roger Stevens LT 24', lecturer: 'Dr. Elena Rossi', status: 'PENDING', date: '2026-03-11' },
  { id: 'f2', module: 'MATH5743M01 - Advanced Statistical Theory', type: 'Lecture', time: '12:00 - 13:00', startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, dayOfWeek: 5, location: 'Roger Stevens LT 07', lecturer: 'Dr. John Harrison', status: 'PENDING', date: '2026-03-13' },
  { id: 'm2_wk6', module: 'COMP5840M01 - Advanced Software Engineering', type: 'Lecture', time: '10:00 - 11:00', startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, dayOfWeek: 1, location: 'Roger Stevens LT 20', lecturer: 'Dr. Sarah Wilson', status: 'PENDING', date: '2026-03-16' },
  { id: 't2_wk6', module: 'MATH5747M01 - Financial Mathematics', type: 'Lecture', time: '16:00 - 18:00', startHour: 16, startMinute: 0, endHour: 18, endMinute: 0, dayOfWeek: 2, location: 'Chemistry West Block LT E', lecturer: 'Prof. David Miller', status: 'PENDING', date: '2026-03-17' },
  { id: 'w2_wk6', module: 'GEOG5917M01 - GIS & Environmental Data', type: 'Practical', time: '13:00 - 16:00', startHour: 13, startMinute: 0, endHour: 16, endMinute: 0, dayOfWeek: 3, location: 'Clarendon Building Cluster', lecturer: 'Dr. Elena Rossi', status: 'PENDING', date: '2026-03-18' },
];

export interface ModuleDetails {
  id: string;
  code: string;
  title: string;
  leader: string;
  credits: number;
  deadline?: {
    taskId: string;
    task: string;
    type: 'quiz' | 'assignment';
    date: string;
    daysRemaining: number;
    isUrgent: boolean;
  };
  progress: number;
}

export const MY_MODULES: ModuleDetails[] = [
  { id: 'm1', code: 'COMP5840M01', title: 'Advanced Software Engineering', leader: 'Dr. Sarah Wilson', credits: 20, deadline: { taskId: 'm1_assignment', task: 'Architecture Specification Draft', type: 'assignment', date: 'In 3 days', daysRemaining: 3, isUrgent: true }, progress: 72 },
  { id: 'm2', code: 'MATH5747M01', title: 'Financial Mathematics', leader: 'Prof. David Miller', credits: 15, deadline: { taskId: 'm2_assignment', task: 'Stochastic Calculus Problem Set', type: 'assignment', date: 'In 12 days', daysRemaining: 12, isUrgent: false }, progress: 45 },
  { id: 'm3', code: 'GEOG5917M01', title: 'GIS and Environmental Data', leader: 'Dr. Elena Rossi', credits: 15, progress: 88 },
  { id: 'm4', code: 'MATH5743M01', title: 'Advanced Statistical Theory', leader: 'Dr. John Harrison', credits: 20, deadline: { taskId: 'm4_quiz', task: 'Bayesian Inference Quiz', type: 'quiz', date: 'Tomorrow', daysRemaining: 1, isUrgent: true }, progress: 30 },
];

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface RoadmapStep {
  id: string; // This ID should match the deadline's taskId if it's a quiz.
  title: string;
  description: string;
  quiz: QuizQuestion[];
}

export const ROADMAP_DATA: { [moduleId: string]: RoadmapStep[] } = {
  'm1': [
    { id: 'm1_quiz_1', title: 'Intro to Software Lifecycles', description: 'Understand Waterfall, Agile, and Spiral models.', quiz: [{ question: 'Which model is iterative?', options: ['Waterfall', 'Agile', 'V-Model'], correctAnswer: 'Agile' }] },
    { id: 'm1_quiz_2', title: 'UML Diagrams', description: 'Learn Use Case and Class diagrams.', quiz: [{ question: 'What does UML stand for?', options: ['Unified Markup Language', 'Universal Modeling Language', 'Unified Modeling Language'], correctAnswer: 'Unified Modeling Language' }] },
  ],
  'm2': [
    { id: 'm2_quiz_1', title: 'Intro to Stochastic Processes', description: 'Basics of random variables and probability.', quiz: [{ question: 'A coin toss is an example of a _____ variable.', options: ['Deterministic', 'Stochastic', 'Continuous'], correctAnswer: 'Stochastic' }] },
  ],
  'm3': [], 
  'm4': [
    { id: 'm4_quiz', title: 'Bayesian Inference', description: 'Understand Bayes\' theorem.', quiz: [{ question: 'What is P(A|B)?', options: ['P(B|A)P(A)/P(B)', 'P(A)P(B)', 'P(A)+P(B)'], correctAnswer: 'P(B|A)P(A)/P(B)' }] }
  ],
};

// Gamification Content
export const AVATAR_ITEMS: AvatarItem[] = [
  // Head
  { id: 'head_default', name: 'Default', type: 'head', cost: 0, icon: '😀' },
  { id: 'head_cool', name: 'Cool Shades', type: 'head', cost: 200, icon: '😎' },
  { id: 'head_love', name: 'Love Eyes', type: 'head', cost: 250, icon: '😍' },
  // Accessory
  { id: 'acc_none', name: 'None', type: 'accessory', cost: 0, icon: ' ' },
  { id: 'acc_hat', name: 'Graduation Cap', type: 'accessory', cost: 500, icon: '🎓' },
  { id: 'acc_crown', name: 'Crown', type: 'accessory', cost: 1000, icon: '👑' },
  // Outfit
  { id: 'outfit_default', name: 'T-Shirt', type: 'outfit', cost: 0, icon: '👕' },
  { id: 'outfit_hoodie', name: 'UoL Hoodie', type: 'outfit', cost: 400, icon: '🧥' },
  { id: 'outfit_suit', name: 'Suit', type: 'outfit', cost: 800, icon: '👔' },
];
