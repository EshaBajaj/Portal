import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Toast Component
const Toast = ({ id, type, title, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300);
  };

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 max-w-sm w-full bg-white border-l-4 rounded-lg shadow-lg p-4 transition-all duration-300 transform z-50";
    
    if (isExiting) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return `${baseStyles} border-green-500`;
      case TOAST_TYPES.ERROR:
        return `${baseStyles} border-red-500`;
      case TOAST_TYPES.WARNING:
        return `${baseStyles} border-yellow-500`;
      case TOAST_TYPES.INFO:
        return `${baseStyles} border-blue-500`;
      default:
        return `${baseStyles} border-gray-500`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0";
    
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case TOAST_TYPES.ERROR:
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case TOAST_TYPES.WARNING:
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case TOAST_TYPES.INFO:
        return <Info className={`${iconClass} text-blue-500`} />;
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
          )}
          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index 
          }}
        >
          <Toast
            {...toast}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: TOAST_TYPES.INFO,
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Toast methods
  const toast = useCallback({
    success: (message, title, options = {}) => 
      addToast({ 
        type: TOAST_TYPES.SUCCESS, 
        message, 
        title, 
        ...options 
      }),
    
    error: (message, title, options = {}) => 
      addToast({ 
        type: TOAST_TYPES.ERROR, 
        message, 
        title, 
        duration: 7000, // Longer duration for errors
        ...options 
      }),
    
    warning: (message, title, options = {}) => 
      addToast({ 
        type: TOAST_TYPES.WARNING, 
        message, 
        title, 
        ...options 
      }),
    
    info: (message, title, options = {}) => 
      addToast({ 
        type: TOAST_TYPES.INFO, 
        message, 
        title, 
        ...options 
      }),

    // Generic method
    show: (message, type = TOAST_TYPES.INFO, title, options = {}) =>
      addToast({ 
        type, 
        message, 
        title, 
        ...options 
      }),

    // Utility methods
    clear: removeAllToasts,
    remove: removeToast
  }, [addToast, removeToast, removeAllToasts]);

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context.toast;
};

// Export individual components for advanced usage
export { Toast, ToastContainer };

// Default export
export default ToastProvider;
