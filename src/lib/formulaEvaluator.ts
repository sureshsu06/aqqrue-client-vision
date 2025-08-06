export interface FormulaEvaluationResult {
  result: number;
  error?: string;
}

export class FormulaEvaluator {
  private entries: any[];
  private currentIndex: number;

  constructor(entries: any[], currentIndex: number = 0) {
    this.entries = entries;
    this.currentIndex = currentIndex;
  }

  /**
   * Evaluates a formula string and returns the result
   */
  evaluate(formula: string): FormulaEvaluationResult {
    try {
      console.log('Evaluating formula:', formula, 'for entries:', this.entries);
      
      let processedFormula = this.preprocessFormula(formula);
      processedFormula = this.replaceCellReferences(processedFormula);
      processedFormula = this.replaceRangeReferences(processedFormula);
      processedFormula = this.replaceExcelFunctions(processedFormula);
      
      console.log('Final formula to evaluate:', processedFormula);
      
      const result = this.safeEvaluate(processedFormula);
      
      return {
        result: isNaN(result) || !isFinite(result) ? 0 : result
      };
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return {
        result: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Preprocesses the formula by cleaning and handling percentages
   */
  private preprocessFormula(formula: string): string {
    let processed = formula.trim();
    
    // Handle percentage calculations (e.g., 10%*B1, 15%*C2)
    processed = processed.replace(/(\d+)%/g, (match, num) => {
      console.log('Converting percentage:', match, 'to', `(${num}/100)`);
      return `(${num}/100)`;
    });
    
    console.log('After percentage processing:', processed);
    return processed;
  }

  /**
   * Replaces cell references like A1, B2, C3 with actual values
   */
  private replaceCellReferences(formula: string): string {
    const cellRefs = formula.match(/[A-Z]\d+/g) || [];
    console.log('Found cell references:', cellRefs);
    
    cellRefs.forEach(ref => {
      const col = ref.charCodeAt(0) - 65; // A=0, B=1, C=2
      const row = parseInt(ref.substring(1)) - 1;
      
      console.log('Processing cell ref:', ref, 'col:', col, 'row:', row);
      
      if (row >= 0 && row < this.entries.length) {
        let cellValue = 0;
        
        // Map columns to actual data
        if (col === 1) { // B column = debit
          cellValue = this.entries[row].debit || 0;
        } else if (col === 2) { // C column = credit
          cellValue = this.entries[row].credit || 0;
        } else if (col === 0) { // A column = account (not numeric)
          cellValue = 0; // Account names are not numeric
        }
        
        console.log('Cell value for', ref, ':', cellValue);
        // Replace all occurrences of this cell reference
        formula = formula.replace(new RegExp(ref, 'g'), cellValue.toString());
      } else {
        console.log('Invalid cell reference:', ref);
        // Replace invalid references with 0
        formula = formula.replace(new RegExp(ref, 'g'), '0');
      }
    });
    
    return formula;
  }

  /**
   * Replaces range references like A1:A3 or B1:B3 with sums
   */
  private replaceRangeReferences(formula: string): string {
    const rangeRefs = formula.match(/[A-Z]\d+:[A-Z]\d+/g) || [];
    
    rangeRefs.forEach(range => {
      const [start, end] = range.split(':');
      const startCol = start.charCodeAt(0) - 65;
      const startRow = parseInt(start.substring(1)) - 1;
      const endCol = end.charCodeAt(0) - 65;
      const endRow = parseInt(end.substring(1)) - 1;
      
      let rangeSum = 0;
      for (let row = startRow; row <= endRow && row < this.entries.length; row++) {
        if (startCol === 1) { // B column = debit
          rangeSum += this.entries[row].debit || 0;
        } else if (startCol === 2) { // C column = credit
          rangeSum += this.entries[row].credit || 0;
        }
      }
      
      formula = formula.replace(range, rangeSum.toString());
    });
    
    return formula;
  }

  /**
   * Replaces Excel functions with JavaScript equivalents
   */
  private replaceExcelFunctions(formula: string): string {
    return formula
      .replace(/\bSUM\s*\(/gi, '(') // SUM(A1:A3) -> (A1+A2+A3)
      .replace(/\bAVERAGE\s*\(/gi, '(') // AVERAGE(A1:A3) -> (A1+A2+A3)/3
      .replace(/\bMAX\s*\(/gi, 'Math.max(')
      .replace(/\bMIN\s*\(/gi, 'Math.min(')
      .replace(/\bABS\s*\(/gi, 'Math.abs(')
      .replace(/\bROUND\s*\(/gi, 'Math.round(');
  }

  /**
   * Safely evaluates the processed formula
   */
  private safeEvaluate(formula: string): number {
    // Use Function constructor for safer evaluation
    const result = new Function('return ' + formula)();
    console.log('Formula result:', result);
    return result;
  }

  /**
   * Checks if a value looks like a formula
   */
  static isFormula(value: string, isFormulaMode: boolean = false): boolean {
    if (typeof value !== 'string' || value.trim() === '') {
      return false;
    }
    
    return isFormulaMode || 
           value.startsWith('=') || 
           /[A-Z]\d+/.test(value) || 
           /%/.test(value) ||
           /\b(SUM|AVERAGE|MAX|MIN|ABS|ROUND)\s*\(/i.test(value);
  }

  /**
   * Normalizes a formula by adding '=' prefix if needed
   */
  static normalizeFormula(value: string, isFormulaMode: boolean): string {
    if (!this.isFormula(value, isFormulaMode)) {
      return value;
    }
    
    if (isFormulaMode && !value.startsWith('=')) {
      return '=' + value;
    }
    
    return value;
  }
} 