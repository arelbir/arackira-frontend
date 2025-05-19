import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  message: string;
  type?: 'error' | 'success' | 'info';
}

interface ToastContextProps {
  toast: Toast | null;
  showToast: (message: string, type?: 'error' | 'success' | 'info') => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (
    message: string,
    type: 'error' | 'success' | 'info' = 'info'
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      {toast && (
        <div
          className={`animate-fade-in-up fixed right-8 bottom-8 z-50 rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
