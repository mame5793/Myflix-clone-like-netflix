// src/context/ToastContext.jsx

import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

export const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const showSuccessToast = useCallback((message) => {
    toast.success(message, {
      autoClose: 2000,
      toastId: Date.now(), // <-- Add this line
    });
  }, []);

  const showErrorToast = useCallback((message) => {
    toast.error(message, {
      toastId: Date.now(), // <-- Add this line
    });
  }, []);

  const value = { showSuccessToast, showErrorToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};