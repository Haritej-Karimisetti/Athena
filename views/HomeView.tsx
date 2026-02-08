
import React, { useState, useEffect, useMemo } from 'react';
import { GRID_ITEMS, MOCK_TIMETABLE } from '../constants';
import { ViewState, TimetableEntry, GridItem } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CircleDashed, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Sun, 
  Lock, 
  Wifi, 
  Navigation,
  Mic,
  Video
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
  xp: number;
  isUniNetwork?: boolean;
  onConnect?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, xp, isUniNetwork = false }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDay = now.getDay();
  const isWeekend = currentDay === 0 || currentDay === 6;

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getSessionState = (session: TimetableEntry) => {
    if (session.dayOfWeek !== currentDay) return 'FUTURE';
    const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const startInSeconds = session.startHour * 3600 + session.startMinute * 60;
    const endInSeconds = session.endHour * 3600 + session.endMinute * 60;
    if (currentTimeInSeconds >= startInSeconds && currentTimeInSeconds < endInSeconds) return 'LIVE';
    if (currentTimeInSeconds < startInSeconds) return 'UPCOMING';
    return 'PAST';
  };

  const todaysSessions = useMemo(() => {
    return MOCK_TIMETABLE.filter(s => s.dayOfWeek === currentDay)
      .sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));
  }, [currentDay]);

  const activeOrNextSession = useMemo(() => {
    const live = todaysSessions.find(s => getSessionState(s) === 'LIVE');
    if (live) return live;
    return todaysSessions.find(s => getSessionState(s) === 'UPCOMING');
  }, [todaysSessions, now]);

  const level = Math.floor(xp / 200);

  const handleGridClick = (item: GridItem) => {
    if (item.externalUrl) {
       window.open(item.externalUrl, '_blank');
    } else if (item.targetView) {
       onNavigate(item.targetView);
    }
  };

  const getSessionIcon = (type: string) => {
    switch(type.toLowerCase()) {
        case 'lecture': return BookOpen;
        case 'practical': return Mic;
        case 'workshop': return Video;
        default: return CircleDashed;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 h-full overflow-y-auto animate-in fade-in duration-500 scroll-smooth">
      
      {/* Header Section */}
      <div className="p-6 pt-8 flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-[28px] font-black text-gray-900 dark:text-white leading-tight">
            {getGreeting()}, Alex
          </h1>
          <div className="flex flex-col gap-2 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
              <span className="text-gray-300 dark:text-gray-700 mx-0.5">|</span>
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            
            <div className={`flex items-center gap-1.5 px-2.5 py-1 w-fit rounded-full border text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-500 ${
              isUniNetwork 
                ? 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.1)]' 
                : 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isUniNetwork ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <Wifi className="w-3 h-3" strokeWidth={3} />
              {isUniNetwork ? 'Campus WiFi Connected' : 'Off-Campus Network'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={() => onNavigate(ViewState.ENGAGEMENT)}
            className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-black text-gray-800 dark:text-gray-200">LVL {level}</span>
          </button>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{xp} XP</span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="px-4 mb-8">
        {!activeOrNextSession || isWeekend ? (
          <div className="relative group overflow-hidden rounded-[32px] bg-[#18181B] p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Weekend Recharge</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">No Classes Scheduled</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[280px]">
                Enjoy your break, Alex! The library is open if you need a quiet space to study.
              </p>
              <button 
                onClick={() => onNavigate(ViewState.MAP)}
                className="w-full bg-white hover:bg-gray-100 text-black rounded-2xl py-4 font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-lg"
              >
                Find a study spot
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 pointer-events-none">
               <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="relative group rounded-[32px] overflow-hidden shadow-2xl shadow-leeds-blue/10 dark:shadow-orange-900/20">
            <div className="absolute inset-0 bg-gradient-to-br from-leeds-blue to-indigo-600 dark:from-orange-700 dark:to-rose-800 animate-hue-rotate opacity-80" />
            <div className="relative w-full bg-white/10 backdrop-blur-lg rounded-[32px] p-7 flex flex-col text-left text-white">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${getSessionState(activeOrNextSession) === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white'}`}>
                    {getSessionState(activeOrNextSession) === 'LIVE' ? 'Happening Now' : 'Up Next'}
                  </div>
                  <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{activeOrNextSession.time}</span>
                </div>
                <button onClick={() => onNavigate(ViewState.TIMETABLE)} className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-black leading-tight mb-2 drop-shadow-md">
                {activeOrNextSession.module.split(' - ')[1] || activeOrNextSession.module}
              </h3>
              <p className="text-sm font-bold text-white/80 mb-8 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {activeOrNextSession.location}
              </p>

              <div className="space-y-3">
                <button 
                    onClick={() => onNavigate(ViewState.CHECK_IN)}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                        isUniNetwork 
                        ? 'bg-white text-leeds-blue dark:text-orange-800' 
                        : 'bg-white/20 text-white border-2 border-white/50'
                    }`}
                >
                    {isUniNetwork ? <Navigation className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                    {isUniNetwork ? 'Check In Now' : 'Check In'}
                </button>
                {!isUniNetwork && (
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-black/20 rounded-xl animate-in fade-in duration-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.1em]">Connect to Campus WiFi to enable</span>
                    </div>
                )}
              </div>
            </div>
            <style>{`@keyframes hue-rotate { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } } .animate-hue-rotate { animation: hue-rotate 20s linear infinite; }`}</style>
          </div>
        )}
      </div>

      {/* Daily Timeline */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-5 px-1">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <Calendar className="w-4 h-4" />
            {isWeekend || todaysSessions.length === 0 ? 'Weekend View' : 'Daily Timeline'}
          </h2>
          <button onClick={() => onNavigate(ViewState.TIMETABLE)} className="text-[10px] font-black text-leeds-blue dark:text-orange-500 uppercase tracking-widest hover:underline transition-all underline-offset-4">
            View Week
          </button>
        </div>

        {todaysSessions.length > 0 && !isWeekend ? (
          <div className="space-y-2">
              {todaysSessions.map((session, index) => {
                 const Icon = getSessionIcon(session.type);
                 return (
                    <div key={session.id} className="flex items-center gap-4 group">
                        <div className="flex flex-col items-center self-stretch">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm z-10">
                                <Icon className="w-5 h-5 text-gray-400 group-hover:text-leeds-blue dark:group-hover:text-orange-500 transition-colors" />
                            </div>
                            {index < todaysSessions.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 dark:bg-gray-800 my-1" />}
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-leeds-blue dark:text-orange-500">{session.type}</p>
                                    <h3 className="font-black text-sm text-gray-900 dark:text-white leading-snug line-clamp-1 mt-1">
                                        {session.module.split(' - ')[1] || session.module}
                                    </h3>
                                </div>
                                <span className="text-xs font-black text-gray-400">{session.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                               <MapPin className="w-3.5 h-3.5 opacity-40" />
                               <span className="text-xs font-bold truncate">{session.location}</span>
                            </div>
                        </div>
                    </div>
                 );
              })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-12 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <Sparkles className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              Your schedule is clear!
            </h3>
            <p className="text-sm font-medium text-gray-400 max-w-[200px] leading-relaxed">
              Perfect time for self-study or society events.
            </p>
          </div>
        )}
      </div>

      {/* Grid Utilities */}
      <div className="px-4 mb-8">
        <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-5 px-1">Tools & Quick Links</h2>
        <div className="grid grid-cols-2 gap-4">
          {GRID_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleGridClick(item)}
              className="group relative flex flex-col justify-between p-5 bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 active:translate-y-0.5 active:shadow-inner transition-all duration-200 aspect-square overflow-hidden hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.colorClass}`} style={{filter: 'blur(30px)'}} />
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${item.colorClass || 'bg-gray-200'}`}>
                <item.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              
              <span className="relative text-sm font-black text-gray-800 dark:text-gray-200 text-left uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};