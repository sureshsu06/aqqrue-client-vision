import { useState, useEffect } from 'react';

interface PanelSizes {
  inbox: number;
  document: number;
  creditCard: number;
  detail: number;
}

const DEFAULT_SIZES: PanelSizes = {
  inbox: 20,
  document: 45,
  creditCard: 35,
  detail: 40,
};

const STORAGE_KEY = 'mobius-panel-sizes';

export function usePanelSizes() {
  const [sizes, setSizes] = useState<PanelSizes>(DEFAULT_SIZES);

  // Load sizes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSizes(parsed);
      } catch (error) {
        console.warn('Failed to parse saved panel sizes:', error);
      }
    }
  }, []);

  // Save sizes to localStorage whenever they change
  const updateSizes = (newSizes: PanelSizes) => {
    setSizes(newSizes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSizes));
  };

  // Reset to default sizes
  const resetSizes = () => {
    updateSizes(DEFAULT_SIZES);
  };

  return {
    sizes,
    updateSizes,
    resetSizes,
  };
} 