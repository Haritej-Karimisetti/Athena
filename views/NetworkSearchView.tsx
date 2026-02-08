import React from 'react';
import { ArrowLeft, Wifi, Terminal, ShieldCheck, Activity } from 'lucide-react';
import { NetworkStatus, NetworkMetadata } from '../services/NetworkService';

interface NetworkSearchViewProps {
  onBack: () => void;
  netStatus: NetworkStatus;
  netMetadata: NetworkMetadata | null;
  onConnect: () => void;
}

export const NetworkSearchView: React.FC<NetworkSearchViewProps> = ({ 
  onBack, netStatus, netMetadata, onConnect 
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* View Header */}
      <div className="bg-white dark:bg-gray-900 p-4 shadow-sm flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Network Search</h2>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Status Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-6 ${
            netStatus === NetworkStatus.CONNECTED ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
          }`}>
            <Wifi className="w-12 h-12" />
          </div>
          
          <h3 className="text-xl font-black mb-2">Campus Infrastructure</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Connecting to the university backbone provides high-speed access to internal resources and attendance verification for Athena.
          </p>

          {netStatus === NetworkStatus.CONNECTED ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-100 dark:border-green-900/30">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-widest">WPA3 Secure</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>

              {netMetadata && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Gateway</p>
                    <p className="text-sm font-bold truncate">{netMetadata.gateway}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Latency</p>
                    <p className="text-sm font-bold">{netMetadata.latency}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onConnect}
              className="w-full py-4 bg-leeds-blue dark:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Initiate Handshake
            </button>
          )}
        </div>

        {/* Diagnostic Logs */}
        <div className="bg-gray-900 rounded-3xl p-5 border border-white/5 font-mono text-[11px] text-leeds-green space-y-2 shadow-2xl">
          <div className="flex items-center gap-2 text-white/40 mb-3 border-b border-white/5 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="uppercase tracking-[0.2em] font-black">Connection Logs</span>
          </div>
          <p className="opacity-50">$ nmap -v -A campus-core-uol</p>
          <p className="opacity-50">Starting Nmap 7.92...</p>
          <p className="text-white font-bold">NSE: Loaded 1 scripts for scanning.</p>
          <p>Scanning node [172.16.0.1]...</p>
          <p>Discovered open port 8021/tcp (802.1x Gateway)</p>
          <p className="text-yellow-500">Warning: PEAP certification requires validation.</p>
        </div>
      </div>
    </div>
  );
};
