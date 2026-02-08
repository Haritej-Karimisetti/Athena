
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ViewState, CheckInSuccessData, AvatarConfig, AvatarItem } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { TimetableView } from './views/TimetableView';
import { CheckInView } from './views/CheckInView';
import { EngagementView } from './views/EngagementView';
import { SettingsView } from './views/SettingsView';
import { CampusLifeView } from './views/CampusLifeView';
import { AthenaAIView } from './views/ChatbotView';
import { SearchView } from './views/SearchView';
import { CampusMapView } from './views/CampusMapView';
import { NetworkSearchView } from './views/NetworkSearchView';
import { networkService, NetworkStatus, NetworkMetadata } from './services/NetworkService';
import { Bell, ArrowLeft, Wifi, CalendarCheck2, Loader2, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { MY_MODULES } from './constants';

export const SOUNDS = [
  { id: 'chime', name: 'Classic Chime', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'pop', name: 'Cheerful Pop', url: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [history, setHistory] = useState<ViewState[]>([ViewState.HOME]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [xp, setXp] = useState(2450);
  const [selectedSoundId, setSelectedSoundId] = useState('chime');
  
  // Real-time Network State
  const [netStatus, setNetStatus] = useState<NetworkStatus>(NetworkStatus.DISCONNECTED);
  const [netMetadata, setNetMetadata] = useState<NetworkMetadata | null>(null);
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Gamification State
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ head: 'head_default', accessory: 'acc_none', outfit: 'outfit_default' });
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['head_default', 'acc_none', 'outfit_default']);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const upcomingDeadlines = MY_MODULES
    .filter(m => m.deadline && !completedTaskIds.includes(m.deadline.taskId))
    .sort((a, b) => a.deadline!.daysRemaining - b.deadline!.daysRemaining);

  const handleConnectToWifi = async () => {
    setIsConnecting(true);
    setHandshakeLogs([]);
    try {
      const meta = await networkService.initiateHandshake((log) => {
        setHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
      });
      setNetStatus(NetworkStatus.CONNECTED);
      setNetMetadata(meta);
      setIsConnecting(false);
    } catch (e) {
      setNetStatus(NetworkStatus.ERROR);
      setIsConnecting(false);
    }
  };

  const handleNavigate = (view: ViewState) => {
    if (view === ViewState.HOME) setHistory([ViewState.HOME]);
    else setHistory(prev => [...prev, view]);
    setCurrentView(view);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentView(newHistory[newHistory.length - 1]);
    }
  };

  const handleCheckInSuccess = useCallback((data: CheckInSuccessData) => {
    setXp(prev => prev + data.xpGained);
  }, []);

  const handleQuizComplete = (taskId: string, score: number, xpGained: number) => {
    setXp(prev => prev + xpGained);
    if (score >= 50 && !completedTaskIds.includes(taskId)) {
      setCompletedTaskIds(prev => [...prev, taskId]);
    }
  };
  
  const handlePurchaseItem = (item: AvatarItem) => {
    if (xp >= item.cost && !unlockedItems.includes(item.id)) {
      setXp(prev => prev - item.cost);
      setUnlockedItems(prev => [...prev, item.id]);
    }
  };

  const handleEquipItem = (item: AvatarItem) => {
    if (unlockedItems.includes(item.id)) {
      setAvatarConfig(prev => ({ ...prev, [item.type]: item.id }));
    }
  };

  const isUniNetwork = netStatus === NetworkStatus.CONNECTED;
  const hideHeader = [ViewState.CHECK_IN, ViewState.SEARCH, ViewState.CHATBOT, ViewState.NETWORK_SEARCH].includes(currentView);
  const hideBottomNav = [ViewState.CHECK_IN, ViewState.SEARCH, ViewState.NETWORK_SEARCH].includes(currentView);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HomeView onNavigate={handleNavigate} xp={xp} isUniNetwork={isUniNetwork} onConnect={handleConnectToWifi} />;
      case ViewState.TIMETABLE:
        return <TimetableView onBack={handleBack} />;
      case ViewState.CHECK_IN:
        return !isUniNetwork ? (
            <div className="flex flex-col h-full bg-white dark:bg-gray-950 p-8 text-center items-center justify-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
               <button onClick={handleBack} className="absolute top-4 left-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><ArrowLeft /></button>
               <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-8 border-2 border-red-100 animate-pulse"><Wifi size={48} className="text-red-600" /></div>
               <h2 className="text-2xl font-black uppercase tracking-tight">Backend Verification Required</h2>
               <p className="text-sm text-gray-500 my-4 max-w-xs leading-relaxed">The Athena Infrastructure requires a secure 802.1x handshake with the campus gateway to verify physical attendance.</p>
               <button onClick={handleConnectToWifi} className="w-full py-4 bg-leeds-blue dark:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Activity className="w-4 h-4" />
                  Initiate Secure Handshake
               </button>
            </div>
          ) : <CheckInView onBack={handleBack} onCheckInSuccess={handleCheckInSuccess} />;
      case ViewState.ENGAGEMENT:
        return <EngagementView onBack={handleBack} xp={xp} avatarConfig={avatarConfig} unlockedItems={unlockedItems} onPurchaseItem={handlePurchaseItem} onEquipItem={handleEquipItem} />;
      case ViewState.SETTINGS:
        return <SettingsView profileImage={profileImage} onProfileImageChange={setProfileImage} selectedSoundId={selectedSoundId} onSoundChange={setSelectedSoundId} isUniNetwork={isUniNetwork} onConnect={handleConnectToWifi} onDisconnect={() => { networkService.disconnect(); setNetStatus(NetworkStatus.DISCONNECTED); setNetMetadata(null); }} />;
      case ViewState.CAMPUS:
        return <CampusLifeView onBack={handleBack} />;
      case ViewState.CHATBOT:
        return <AthenaAIView onBack={handleBack} onQuizComplete={handleQuizComplete} />;
      case ViewState.MAP:
        return <CampusMapView onBack={handleBack} />;
      case ViewState.NETWORK_SEARCH:
        return <NetworkSearchView onBack={handleBack} netStatus={netStatus} netMetadata={netMetadata} onConnect={handleConnectToWifi} />;
      case ViewState.ANNOUNCEMENTS:
        return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
             <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700">
                <button onClick={handleBack} className="p-1"><ArrowLeft /></button>
                <h2 className="text-xl font-bold">Announcements</h2>
             </div>
             <div className="p-4 space-y-3">
                {upcomingDeadlines.length > 0 ? upcomingDeadlines.map(m => (
                    <div key={m.id} className={`p-4 rounded-2xl border flex gap-4 ${m.deadline!.isUrgent ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
                        <div className={`p-2 rounded-xl h-fit ${m.deadline!.isUrgent ? 'text-red-600' : 'text-leeds-blue dark:text-orange-500'}`}><CalendarCheck2 /></div>
                        <div>
                          <p className={`font-bold text-sm ${m.deadline!.isUrgent ? 'text-red-800 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>{m.deadline!.task}</p>
                          <p className="text-xs text-gray-500">{m.code} - Due <span className="font-bold">{m.deadline!.date}</span></p>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-bold">No upcoming deadlines</p>
                    </div>
                )}
             </div>
          </div>
        );
      case ViewState.SEARCH:
        return <SearchView onBack={handleBack} onNavigate={handleNavigate} />;
      default:
        return <HomeView onNavigate={handleNavigate} xp={xp} isUniNetwork={isUniNetwork} onConnect={handleConnectToWifi} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans overflow-hidden">
      <audio ref={audioRef} className="hidden" />
      
      {/* Handshake Overlay */}
      {isConnecting && (
        <div className="fixed inset-0 z-[200] bg-gray-950/98 backdrop-blur-2xl flex flex-col p-8 animate-in fade-in duration-300">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="relative mb-12">
                <Wifi className="w-20 h-20 text-white animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-32 h-32 text-leeds-blue animate-spin-slow opacity-30" />
                </div>
             </div>
             <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-2">Verifying Node</h2>
             <p className="text-leeds-blue text-[11px] font-black uppercase tracking-[0.2em] mb-8">Establishing Secure University Protocol</p>
          </div>
          <div className="h-56 bg-black/60 rounded-3xl border border-white/10 p-5 font-mono text-[10px] text-leeds-green overflow-y-auto mb-8 flex flex-col gap-1.5 shadow-2xl">
             {handshakeLogs.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-left duration-200 flex gap-2">
                  <span className="text-white/20">#</span> 
                  <span className="flex-1">{log}</span>
                </div>
             ))}
             <div ref={logsEndRef} />
          </div>
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-leeds-green" />
               <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">WPA3 Enterprise Secure</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-leeds-green animate-pulse" />
          </div>
        </div>
      )}

      {!hideHeader && <Header onNavigate={handleNavigate} profileImage={profileImage} hasNotifications={upcomingDeadlines.length > 0} />}
      <main className={`flex-1 overflow-hidden relative ${!hideBottomNav ? 'pb-16' : ''}`}>
        {renderContent()}
      </main>
      {!hideBottomNav && <BottomNav currentView={currentView} onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
