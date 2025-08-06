import { useState } from 'react';

export function useFormulaMode() {
  const [isFormulaMode, setIsFormulaMode] = useState(false);

  const toggleFormulaMode = () => {
    setIsFormulaMode(!isFormulaMode);
  };

  const enableFormulaMode = () => {
    setIsFormulaMode(true);
  };

  const disableFormulaMode = () => {
    setIsFormulaMode(false);
  };

  return {
    isFormulaMode,
    toggleFormulaMode,
    enableFormulaMode,
    disableFormulaMode
  };
} 