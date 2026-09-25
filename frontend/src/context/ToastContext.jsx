import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: '380px',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: toast.type === 'error' ? 'var(--color-surface)' : 'var(--color-primary)',
              color: toast.type === 'error' ? 'var(--color-text-main)' : '#FFFFFF',
              border: toast.type === 'error' ? '2px solid var(--color-primary)' : '1px solid var(--color-primary-dark)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-family)',
              fontSize: '0.92rem',
              fontWeight: 'var(--font-weight-bold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              cursor: 'pointer',
              animation: 'fadeIn 240ms ease-out forwards',
            }}
          >
            <span>{toast.message}</span>
            <span style={{ opacity: 0.7, fontSize: '1.1rem' }}>&times;</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
