
import React, { useRef, useState } from 'react';
import { 
  Moon, Sun, ChevronRight, LogOut, Bell, Shield, User, 
  GraduationCap, Mail, CreditCard, Camera, ArrowLeft,
  CheckCircle2, AlertCircle, Smartphone, Lock, Eye, 
  MapPin, Database, Trash2, Volume2, Play, Sparkles,
  Wifi, ShieldCheck, Globe, WifiOff, FileJson, HardDrive, 
  BellRing, MessageSquare, Megaphone, CalendarClock
} from 'lucide-react';
import { SOUNDS } from '../App';

interface SettingsViewProps {
  profileImage: string | null;
  onProfileImageChange: (img: string | null) => void;
  selectedSoundId: string;
  onSoundChange: (id: string) => void;
  onTestNotification?: () => void;
  isUniNetwork?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

type SettingsSubView = 'main' | 'personal' | 'notifications' | 'privacy' | 'logout_confirm';

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  profileImage, onProfileImageChange, selectedSoundId, onSoundChange, onTestNotification,
  isUniNetwork = false, onConnect, onDisconnect 
}) => {
  const [isDark, setIsDark] = useState(false);
  const [currentSubView, setCurrentSubView] = useState<SettingsSubView>('main');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const [notifs, setNotifs] = useState({ 
    timetable: true, 
    attendance: true, 
    community: false, 
    staff: true,
    socials: true
  });
  
  const [privacy, setPrivacy] = useState({ 
    profilePublic: false, 
    locationCheckin: true, 
    analytics: true,
    stealthMode: false
  });

  React.useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleSoundPreview = (url: string) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.src = url;
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current.play();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      onProfileImageChange(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const SettingItem = ({ icon: Icon, label, value, onClick, colorClass, subtitle }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${colorClass}`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClass ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Icon className={`w-5 h-5 ${colorClass ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
            </div>
            <div className="text-left">
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{label}</p>
                {subtitle && <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>}
            </div>
        </div>
        <div className="flex items-center gap-2">
            {value}
            <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
    </button>
  );

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full p-1 transition-colors ${active ? 'bg-leeds-blue dark:bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  // PERSONAL VIEW
  if (currentSubView === 'personal') {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-in slide-in-from-right duration-200">
        <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700">
          <button onClick={() => setCurrentSubView('main')} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black uppercase tracking-tight">Personal Details</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-leeds-blue/10 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-4 border-2 border-leeds-blue/20">
                <User className="w-12 h-12 text-leeds-blue dark:text-orange-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Authenticated Student</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Alex J. Student</h3>
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-700">
              {[
                { label: 'University ID', value: '20156789', icon: CreditCard },
                { label: 'Course', value: 'Computer Science (BSc)', icon: GraduationCap },
                { label: 'Year of Study', value: 'Year 3 (Final)', icon: Smartphone },
                { label: 'Primary Email', value: 'alex@leeds.ac.uk', icon: Mail },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><item.icon className="w-4 h-4 text-leeds-blue dark:text-orange-500" /></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NOTIFICATIONS VIEW
  if (currentSubView === 'notifications') {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700">
          <button onClick={() => setCurrentSubView('main')} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black uppercase tracking-tight">Alerts & Sounds</h2>
        </div>
        
        <div className="p-4 space-y-6">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Channel Preferences</h3>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700">
              {[
                { key: 'timetable', label: 'Timetable Changes', sub: 'Room moves & cancellations', icon: CalendarClock },
                { key: 'attendance', label: 'Attendance Nudges', sub: 'Engagement risk alerts', icon: BellRing },
                { key: 'community', label: 'Community Mentions', sub: 'Tag notifications in feed', icon: MessageSquare },
                { key: 'staff', label: 'Staff Announcements', sub: 'Official university updates', icon: Megaphone }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl"><item.icon className="w-4 h-4 text-gray-500" /></div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                  <Toggle 
                    active={(notifs as any)[item.key]} 
                    onToggle={() => setNotifs(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))} 
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sound Profile</h3>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               {SOUNDS.map(sound => (
                 <button 
                   key={sound.id}
                   onClick={() => onSoundChange(sound.id)}
                   className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                 >
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-xl ${selectedSoundId === sound.id ? 'bg-leeds-blue/10 text-leeds-blue dark:bg-orange-500/10 dark:text-orange-500' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'}`}>
                        <Volume2 className="w-4 h-4" />
                     </div>
                     <span className={`text-sm font-bold ${selectedSoundId === sound.id ? 'text-leeds-blue dark:text-orange-500' : 'text-gray-600 dark:text-gray-300'}`}>{sound.name}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSoundPreview(sound.url); }}
                        className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full hover:scale-110 active:scale-95 transition-all"
                      >
                        <Play className="w-3 h-3 text-gray-500" />
                      </button>
                      {selectedSoundId === sound.id && <CheckCircle2 className="w-5 h-5 text-leeds-blue dark:text-orange-500" />}
                   </div>
                 </button>
               ))}
            </div>
          </section>

          <button 
            onClick={onTestNotification}
            className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-200 dark:border-gray-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <BellRing className="w-4 h-4" />
            Send Test Alert
          </button>
        </div>
        <audio ref={previewAudioRef} className="hidden" />
      </div>
    );
  }

  // PRIVACY VIEW
  if (currentSubView === 'privacy') {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-in slide-in-from-right duration-200">
        <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700">
          <button onClick={() => setCurrentSubView('main')} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black uppercase tracking-tight">Privacy Center</h2>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto">
          <section className="space-y-3">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visibility & Tracking</h3>
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl"><Eye className="w-4 h-4 text-gray-500" /></div>
                    <div className="text-left">
                       <p className="text-sm font-bold">Public Community Profile</p>
                       <p className="text-[10px] text-gray-400">Allow other students to see your level/XP</p>
                    </div>
                  </div>
                  <Toggle active={privacy.profilePublic} onToggle={() => setPrivacy(p => ({ ...p, profilePublic: !p.profilePublic }))} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl"><MapPin className="w-4 h-4 text-gray-500" /></div>
                    <div className="text-left">
                       <p className="text-sm font-bold">Location-Based Check-In</p>
                       <p className="text-[10px] text-gray-400">Required for verified physical attendance</p>
                    </div>
                  </div>
                  <Toggle active={privacy.locationCheckin} onToggle={() => setPrivacy(p => ({ ...p, locationCheckin: !p.locationCheckin }))} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl"><Database className="w-4 h-4 text-gray-500" /></div>
                    <div className="text-left">
                       <p className="text-sm font-bold">Anonymous Analytics</p>
                       <p className="text-[10px] text-gray-400">Help improve the Athena experience</p>
                    </div>
                  </div>
                  <Toggle active={privacy.analytics} onToggle={() => setPrivacy(p => ({ ...p, analytics: !p.analytics }))} />
                </div>
             </div>
          </section>

          <section className="space-y-3">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data Management</h3>
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-leeds-blue"><FileJson className="w-4 h-4" /></div>
                    <div className="text-left flex-1">
                       <p className="text-sm font-bold">Export My Personal Data</p>
                       <p className="text-[10px] text-gray-400">Download a .JSON of your engagement history</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
                <button className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600">
                    <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-xl"><Trash2 className="w-4 h-4" /></div>
                    <div className="text-left flex-1">
                       <p className="text-sm font-bold">Purge Local App Cache</p>
                       <p className="text-[10px] text-red-400/60 font-medium italic">Cannot be undone</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-200" />
                </button>
             </div>
          </section>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
             <div className="flex gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-leeds-green" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Security Standard</span>
             </div>
             <p className="text-[10px] leading-relaxed text-gray-400">
                Athena follows the University of Leeds Data Protection Policy. Your attendance data is end-to-end encrypted and shared only with the Student Success & Registry teams for academic support purposes.
             </p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SETTINGS VIEW
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24 overflow-y-auto">
         <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Profile & Preferences</h2>
         </div>

         <div className="space-y-6 px-4 py-6">
             {/* Profile Header Card */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center border border-gray-100 dark:border-gray-800">
                <div className="relative group">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-28 h-28 bg-leeds-blue dark:bg-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-black mb-4 shadow-xl overflow-hidden relative active:scale-95 transition-transform border-4 border-white dark:border-gray-700"
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            "AS"
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Alex Student</h3>
                <p className="text-leeds-blue dark:text-orange-400 font-bold text-sm mb-4">Computer Science (BSc)</p>
                <div className="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                   Authenticated via Office365
                </div>
             </div>

             <section className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account & Security</h3>
                <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    <SettingItem 
                      icon={User} 
                      label="Personal Details" 
                      subtitle="ID, Course, Contact Info"
                      onClick={() => setCurrentSubView('personal')} 
                    />
                    <SettingItem 
                      icon={Bell} 
                      label="Notifications & Sounds" 
                      subtitle="Volume, Triggers, Preview"
                      onClick={() => setCurrentSubView('notifications')} 
                    />
                    <SettingItem 
                      icon={Shield} 
                      label="Privacy & Security" 
                      subtitle="Visibility, Data, Permissions"
                      onClick={() => setCurrentSubView('privacy')} 
                    />
                </div>
             </section>

             <section className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">App Configuration</h3>
                <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-xl">
                                {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
                            </div>
                            <div className="text-left">
                               <p className="text-sm font-bold text-gray-900 dark:text-gray-100">App Theme</p>
                               <p className="text-[10px] text-gray-400">{isDark ? 'Obsidian Mode Active' : 'Paper Mode Active'}</p>
                            </div>
                        </div>
                        <Toggle active={isDark} onToggle={toggleTheme} />
                    </button>
                    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-50 dark:border-gray-700">
                        <div className="flex items-center gap-3 text-left">
                            <div className={`p-2 rounded-xl ${isUniNetwork ? 'bg-green-50 text-green-500 dark:bg-green-950/40' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'}`}>
                               <Wifi className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Simulate Campus WiFi</span>
                                <p className="text-[10px] text-gray-400">For offline check-in testing</p>
                            </div>
                        </div>
                        <Toggle active={isUniNetwork} onToggle={() => isUniNetwork ? onDisconnect() : onConnect()} />
                    </div>
                </div>
             </section>

             <div className="rounded-3xl overflow-hidden shadow-sm mt-4 border border-gray-100 dark:border-gray-800">
                 <SettingItem 
                   icon={LogOut} 
                   label="Log Out Session" 
                   onClick={() => setCurrentSubView('logout_confirm')} 
                   colorClass="text-red-600" 
                 />
             </div>
             
             <div className="text-center space-y-1 py-8">
                 <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-gray-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Athena v1.1.0-Release</span>
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">University of Leeds IT Services</p>
                 <p className="text-[9px] text-gray-300 dark:text-gray-700 font-medium italic">© 2026 Leeds Digital Companion Project</p>
             </div>
         </div>
    </div>
  );
};
