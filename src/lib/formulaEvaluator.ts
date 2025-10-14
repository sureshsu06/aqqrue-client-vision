// Formula evaluation utility for journal entries
export function evaluateFormula(formula: string, entries: any[], currentIndex: number) {
  console.log('Evaluating formula:', formula, 'for entries:', entries);
  
  // Clean the formula and handle basic operations
  let processedFormula = formula.trim();
  
  // Handle percentage calculations (e.g., 10%*B1, 15%*C2)
  processedFormula = processedFormula.replace(/(\d+)%/g, (match, num) => {
    console.log('Converting percentage:', match, 'to', `(${num}/100)`);
    return `(${num}/100)`;
  });
  
  console.log('After percentage processing:', processedFormula);
  
  // Handle cell references like A1, B2, C3, etc.
  // A = Account column (not used for calculations)
  // B = Debit column (index 1)
  // C = Credit column (index 2)
  const cellRefs = processedFormula.match(/[A-Z]\d+/g) || [];
  console.log('Found cell references:', cellRefs);
  
  cellRefs.forEach(ref => {
    const col = ref.charCodeAt(0) - 65; // A=0, B=1, C=2
    const row = parseInt(ref.substring(1)) - 1;
    
    console.log('Processing cell ref:', ref, 'col:', col, 'row:', row);
    
    if (row >= 0 && row < entries.length) {
      let cellValue = 0;
      
      // Map columns to actual data
      if (col === 1) { // B column = debit
        cellValue = entries[row].debit || 0;
      } else if (col === 2) { // C column = credit
        cellValue = entries[row].credit || 0;
      } else if (col === 0) { // A column = account (not numeric)
        cellValue = 0; // Account names are not numeric
      }
      
      console.log('Cell value for', ref, ':', cellValue);
      // Replace all occurrences of this cell reference
      processedFormula = processedFormula.replace(new RegExp(ref, 'g'), cellValue.toString());
    } else {
      console.log('Invalid cell reference:', ref);
      // Replace invalid references with 0
      processedFormula = processedFormula.replace(new RegExp(ref, 'g'), '0');
    }
  });
  
  // Basic math evaluation with safety
  console.log('Final formula to evaluate:', processedFormula);
  
  try {
    // Replace common Excel functions with JavaScript equivalents
    processedFormula = processedFormula
      .replace(/\bSUM\s*\(/gi, '(') // SUM(A1:A3) -> (A1+A2+A3)
      .replace(/\bAVERAGE\s*\(/gi, '(') // AVERAGE(A1:A3) -> (A1+A2+A3)/3
      .replace(/\bMAX\s*\(/gi, 'Math.max(')
      .replace(/\bMIN\s*\(/gi, 'Math.min(')
      .replace(/\bABS\s*\(/gi, 'Math.abs(')
      .replace(/\bROUND\s*\(/gi, 'Math.round(');
    
    // Handle range references like A1:A3 or B1:B3
    const rangeRefs = processedFormula.match(/[A-Z]\d+:[A-Z]\d+/g) || [];
    rangeRefs.forEach(range => {
      const [start, end] = range.split(':');
      const startCol = start.charCodeAt(0) - 65;
      const startRow = parseInt(start.substring(1)) - 1;
      const endCol = end.charCodeAt(0) - 65;
      const endRow = parseInt(end.substring(1)) - 1;
      
      let rangeSum = 0;
      for (let row = startRow; row <= endRow && row < entries.length; row++) {
        if (startCol === 1) { // B column = debit
          rangeSum += entries[row].debit || 0;
        } else if (startCol === 2) { // C column = credit
          rangeSum += entries[row].credit || 0;
        }
      }
      
      processedFormula = processedFormula.replace(range, rangeSum.toString());
    });
    
    // At this point, processedFormula should only contain numbers and mathematical operators
    console.log('Processed formula for evaluation:', processedFormula);
    
    // Use Function constructor for safer evaluation
    const result = new Function('return ' + processedFormula)();
    console.log('Formula result:', result);
    
    // Return 0 if result is NaN or infinite
    return isNaN(result) || !isFinite(result) ? 0 : result;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 0;
  }
}