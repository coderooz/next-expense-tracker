'use client';

import { useApp } from '@/context/AppContext';

export function useToast() {
  const { toast, showToast, hideToast } = useApp();
  return { toast, showToast, hideToast };
}

export default useToast;
