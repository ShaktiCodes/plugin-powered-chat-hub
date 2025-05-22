
import React from 'react';
import { Plugin } from '../types';

interface CalculatorResult {
  expression: string;
  result: number | string;
}

const CalculatorPlugin: Plugin = {
  name: 'calc',
  description: 'Calculate mathematical expressions',
  command: '/calc',
  pattern: /^\/calc\s+(.+)$/i,
  
  async execute(params: string): Promise<CalculatorResult> {
    try {
      const expression = params.trim();
      
      // Security: Validate input to prevent code execution
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new Error("Invalid expression. Only numbers and basic operators (+, -, *, /, parentheses) are allowed.");
      }
      
      // Safe evaluation of mathematical expression
      // We use Function constructor with strict mode to prevent access to global scope
      const result = Function('"use strict"; return (' + expression + ')')();
      
      // Check if result is a valid number
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error("The expression did not evaluate to a valid number.");
      }
      
      return {
        expression,
        result
      };
    } catch (error) {
      console.error('Calculator error:', error);
      throw new Error(`Unable to calculate. ${error instanceof Error ? error.message : 'Please check your expression.'}`);
    }
  },
  
  renderContent(data: CalculatorResult) {
    return (
      <div className="plugin-card plugin-card-calc rounded-lg p-4 text-white animate-fade-in">
        <h3 className="text-lg font-semibold mb-2">Calculator</h3>
        <div className="flex flex-col">
          <span className="text-gray-300 mb-1">Expression:</span>
          <span className="text-sm mb-3 font-mono">{data.expression}</span>
          <span className="text-gray-300 mb-1">Result:</span>
          <span className="text-xl font-bold">{data.result}</span>
        </div>
      </div>
    );
  }
};

export default CalculatorPlugin;
