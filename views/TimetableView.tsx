import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, MapPin, User, CheckCircle2, XCircle, CircleDashed, Calendar, Play } from 'lucide-react';
import { MOCK_TIMETABLE } from '../constants';
import { TimetableEntry } from '../types';

interface TimetableViewProps {
  onBack: () => void;
}

type ViewMode = 'week' | 'semester';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Moved getSessionState outside the component to prevent re-declaration on each render.
// It now takes `now` as an argument.
const getSessionState = (session: TimetableEntry, now: Date) => {
  if (session.dayOfWeek !== now.getDay()) return 'FUTURE';
  const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60;
  const startInSeconds = session.startHour * 3600 + session.startMinute * 60;
  const endInSeconds = session.endHour * 3600 + session.endMinute * 60;
  if (currentTimeInSeconds >= startInSeconds && currentTimeInSeconds < endInSeconds) return 'LIVE';
  if (currentTimeInSeconds < startInSeconds) return 'UPCOMING';
  return 'PAST';
};

// FIX: Defined a specific interface for SessionCard props to resolve the TypeScript error with the `key` prop.
interface SessionCardProps {
  entry: TimetableEntry;
  now: Date;
}

// Moved SessionCard outside of TimetableView to prevent re-declaration on each render
// and to fix the TypeScript error with the `key` prop.
const SessionCard: React.FC<SessionCardProps> = ({ entry, now }) => {
  const sessionState = getSessionState(entry, now);
  const StatusIcon = sessionState === 'LIVE' ? Play : entry.status === 'CHECKED_IN' ? CheckCircle2 : entry.status === 'MISSED' ? XCircle : CircleDashed;
  return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 ${sessionState === 'PAST' ? 'opacity-50' : ''} ${sessionState === 'LIVE' ? 'ring-2 ring-leeds-blue dark:ring-orange-500' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
              <h3 className="font-black text-sm text-gray-900 dark:text-white line-clamp-1">{entry.module.split(' - ')[1] || entry.module}</h3>
              <p className="text-[10px] font-bold text-leeds-blue dark:text-orange-500 uppercase tracking-wider">{entry.type}</p>
            </div>
            <span className="text-xs font-bold text-gray-400">{entry.time}</span>
        </div>
        <div className="flex items-center gap-4 pt-3 mt-3 border-t border-gray-50 dark:border-gray-700/50 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500"><MapPin size={14} />{entry.location}</span>
        </div>
      </div>
  );
};


export const TimetableView: React.FC<TimetableViewProps> = ({ onBack }) => {
  const [now, setNow] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(() => (now.getDay() === 0 || now.getDay() === 6) ? 1 : now.getDay());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daySessions = useMemo(() => MOCK_TIMETABLE.filter(s => s.dayOfWeek === selectedDay).sort((a, b) => a.startHour - b.startHour), [selectedDay]);

  const semesterSessions = useMemo(() => {
    const grouped = MOCK_TIMETABLE.reduce((acc, session) => {
        const date = session.date || 'Unknown Date';
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
    }, {} as Record<string, TimetableEntry[]>);

    return Object.entries(grouped).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
  }, []);
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
          <h2 className="text-xl font-bold">My Timetable</h2>
        </div>
        <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full flex gap-1">
            <button onClick={() => setViewMode('week')} className={`w-1/2 py-2 rounded-full text-xs font-bold ${viewMode === 'week' ? 'bg-white dark:bg-gray-800 shadow text-leeds-blue dark:text-orange-500' : 'text-gray-500'}`}>This Week</button>
            <button onClick={() => setViewMode('semester')} className={`w-1/2 py-2 rounded-full text-xs font-bold ${viewMode === 'semester' ? 'bg-white dark:bg-gray-800 shadow text-leeds-blue dark:text-orange-500' : 'text-gray-500'}`}>Full Semester</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'week' ? (
          <>
            <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5].map(dayIdx => (
                <button key={dayIdx} onClick={() => setSelectedDay(dayIdx)} className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold ${selectedDay === dayIdx ? 'bg-leeds-blue text-white shadow' : 'bg-white dark:bg-gray-800'}`}>
                  {DAYS[dayIdx].substring(0, 3)}
                </button>
              ))}
            </div>
            <div className="p-4 pt-0 space-y-3">
              <h3 className="text-sm font-bold ml-1">{DAYS[selectedDay]}</h3>
              {daySessions.length > 0 ? daySessions.map(entry => <SessionCard key={entry.id} entry={entry} now={now} />) : <p className="text-xs text-gray-400 p-4 text-center">No classes scheduled.</p>}
            </div>
          </>
        ) : (
          <div className="p-4 space-y-6">
            {semesterSessions.map(([date, sessions]) => (
              <div key={date}>
                <h3 className="font-bold mb-3 text-sm">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                <div className="space-y-3">
                    {sessions.sort((a,b) => a.startHour - b.startHour).map(s => <SessionCard key={s.id} entry={s} now={now} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
