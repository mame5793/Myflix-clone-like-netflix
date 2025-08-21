// src/hooks/useToast.jsx

import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext.jsx';

export const useToast = () => {
    return useContext(ToastContext);
};