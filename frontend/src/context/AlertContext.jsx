import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // type can be: 'success', 'warning', 'error', 'info'
  const addAlert = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {alerts.map((alert) => {
          const isSuccess = alert.type === 'success';
          const isWarning = alert.type === 'warning';
          const isError = alert.type === 'error';
          const isInfo = alert.type === 'info';

          return (
            <div
              key={alert.id}
              className={twMerge(
                clsx(
                  'flex items-center gap-3 w-80 p-4 rounded-xl shadow-lg border transition-all duration-300 transform',
                  {
                    'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300': isSuccess,
                    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300': isWarning,
                    'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300': isError,
                    'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300': isInfo,
                  }
                )
              )}
            >
              {isSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              {isError && <XCircle className="w-5 h-5 text-red-500" />}
              {isInfo && <Info className="w-5 h-5 text-blue-500" />}
              
              <div className="flex-1 font-medium text-sm">{alert.message}</div>
              
              <button onClick={() => removeAlert(alert.id)} className="opacity-70 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
