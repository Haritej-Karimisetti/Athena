
import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ArrowLeft, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { CheckInSuccessData } from '../types';
import { MOCK_TIMETABLE } from '../constants';

interface CheckInViewProps {
  onBack: () => void;
  onCheckInSuccess: (data: CheckInSuccessData) => void;
}

type ScanStatus = 'SCANNING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface ScanState {
  status: ScanStatus;
  message: string;
  data?: CheckInSuccessData | null;
  isRetryable?: boolean;
}

// Replaced live server call with a local mock validation for development.
// This simulates the check-in process without requiring a configured backend.
const mockCheckInValidation = async (qrData: string): Promise<{ status: 'SUCCESS' | 'ERROR'; message: string; data?: CheckInSuccessData, isRetryable?: boolean }> => {
  return new Promise(resolve => {
    // Simulate network delay for realism
    setTimeout(() => {
      try {
        const { sessionId, token } = JSON.parse(qrData);

        if (!sessionId || !token) {
          resolve({ status: 'ERROR', message: 'This is not a valid Athena QR code.', isRetryable: true });
          return;
        }

        if (token !== 'valid') {
            resolve({ status: 'ERROR', message: 'This QR code has expired or is invalid.', isRetryable: false });
            return;
        }

        const session = MOCK_TIMETABLE.find(s => s.id === sessionId);

        if (!session) {
          resolve({ status: 'ERROR', message: 'This class is not found in your timetable.', isRetryable: true });
          return;
        }
        
        // Validation is successful
        const successData: CheckInSuccessData = {
          xpGained: 50,
          currentStreak: 15, // Using mock data for demonstration
        };

        resolve({
          status: 'SUCCESS',
          message: `You've successfully checked in for ${session.module.split(' - ')[1] || session.module}.`,
          data: successData,
          isRetryable: false
        });

      } catch (e) {
        if (e instanceof SyntaxError) {
          resolve({ status: 'ERROR', message: 'This is not a valid Athena QR code.', isRetryable: true });
        } else {
          console.error("Mock check-in error:", e);
          resolve({ status: 'ERROR', message: 'An unexpected local error occurred.', isRetryable: true });
        }
      }
    }, 1500); // 1.5 second simulated processing delay
  });
};


export const CheckInView: React.FC<CheckInViewProps> = ({ onBack, onCheckInSuccess }) => {
  const [scanState, setScanState] = useState<ScanState>({ status: 'SCANNING', message: '' });
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Initialize the scanner instance if it doesn't exist.
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader", {
          // Setting verbose to false can reduce console noise
          verbose: false
      });
    }
    const qrScanner = scannerRef.current;

    const onScanSuccess = (decodedText: string) => {
      // Stop scanning as soon as a valid QR is found
      if (qrScanner.isScanning) {
        qrScanner.stop().catch(e => console.error("Error stopping scanner on success", e));
      }
      
      setScanState({ status: 'PROCESSING', message: 'Verifying code...' });

      mockCheckInValidation(decodedText).then(response => {
        if (response.status === 'SUCCESS' && response.data) {
          setScanState({ status: 'SUCCESS', message: response.message, data: response.data });
          onCheckInSuccess(response.data);
        } else {
          setScanState({ status: 'ERROR', message: response.message, isRetryable: response.isRetryable });
        }
      });
    };

    // Start scanning only when the UI state is 'SCANNING'
    if (scanState.status === 'SCANNING' && !qrScanner.isScanning) {
      const config = { fps: 30, qrbox: { width: 280, height: 280 } };
      qrScanner.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        () => {} // qrCodeErrorCallback - intentionally empty
      ).catch(() => {
        setScanState({ status: 'ERROR', message: 'Could not start camera. Please check permissions.', isRetryable: false });
      });
    }

    // Cleanup: This runs when the component unmounts or dependencies change.
    // It ensures the camera is always released when leaving the screen.
    return () => {
      if (qrScanner && qrScanner.isScanning) {
        qrScanner.stop().catch(err => {
          console.error("Failed to stop the scanner on cleanup.", err);
        });
      }
    };
  }, [scanState.status, onCheckInSuccess]);

  const handleRetry = () => {
    setScanState({ status: 'SCANNING', message: '' });
  };
  
  const renderContent = () => {
    switch (scanState.status) {
      case 'SUCCESS':
        return (
          <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
            <CheckCircle2 className="w-24 h-24 text-leeds-green mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Check-in Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xs">
              {scanState.message} Your progress has been updated.
            </p>
            <div className="flex items-center gap-4 mb-8">
                <div className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-leeds-blue dark:text-blue-400 rounded-2xl font-black text-sm uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                  +{scanState.data?.xpGained} XP
                </div>
                <div className="px-5 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-2xl font-black text-sm uppercase tracking-widest border border-green-100 dark:border-green-800">
                  Streak: {scanState.data?.currentStreak} Days
                </div>
            </div>
            <button 
              onClick={onBack}
              className="w-full py-4 bg-leeds-blue dark:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform"
            >
              Return to Home
            </button>
          </div>
        );
      case 'ERROR':
        return (
          <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
            <XCircle className="w-24 h-24 text-leeds-red mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-red-700 dark:text-red-400">Check-in Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xs">
              {scanState.message}
            </p>
            <div className="w-full space-y-3">
              {scanState.isRetryable && (
                 <button 
                   onClick={handleRetry}
                   className="w-full py-4 bg-leeds-blue dark:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                 >
                   <RefreshCw className="w-4 h-4" />
                   Try Again
                 </button>
              )}
               <button 
                onClick={onBack}
                className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl font-bold transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        );
      default: // SCANNING or PROCESSING
        return (
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
              <div id="qr-reader" className="w-full h-full" />

              {/* Scanner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-72 h-72">
                      <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
                      <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
                      <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
                      <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />
                      
                      <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-red-500/80 shadow-lg shadow-red-500/50 animate-pulse" style={{ animation: 'scan 2s infinite cubic-bezier(0.5, 0, 0.5, 1)' }} />
                  </div>
              </div>
            
              <div className="absolute bottom-20 text-white text-center w-full z-10 p-4">
                  <p className="font-semibold text-lg drop-shadow-md">Align QR code within frame</p>
                  <p className="text-sm opacity-80 drop-shadow-md">Scanning for attendance...</p>
              </div>

              {scanState.status === 'PROCESSING' && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 z-20">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                      <p className="text-white font-bold">{scanState.message}</p>
                  </div>
              )}
              <style>{`
                @keyframes scan {
                    0%, 100% { transform: translateY(-130px); }
                    50% { transform: translateY(130px); }
                }
              `}</style>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      <button 
        onClick={onBack} 
        className="absolute top-4 left-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      {renderContent()}
    </div>
  );
};
