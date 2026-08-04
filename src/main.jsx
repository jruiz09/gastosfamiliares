import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom/client';

import { registerSW } from 'virtual:pwa-register';

import {
  QueryClientProvider,
} from '@tanstack/react-query';

import App from './App';
import queryClient from './lib/queryClient';

import './index.css';

registerSW({
  immediate: true,
  onNeedRefresh() {},
  onOfflineReady() {},
});

function AppBootstrap() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <div className="fixed left-3 top-3 z-[120] rounded-full border border-pink-100 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
        {isOnline ? 'Online' : 'Offline'}
      </div>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </>
  );
}

export { AppBootstrap };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppBootstrap />
  </React.StrictMode>
);