
import React from 'react';
import { Plugin } from '../types';

interface DictionaryResult {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

const DictionaryPlugin: Plugin = {
  name: 'define',
  description: 'Look up word definitions',
  command: '/define',
  pattern: /^\/define\s+(.+)$/i,
  
  async execute(params: string): Promise<DictionaryResult> {
    try {
      const word = params.trim();
      
      // Call the Dictionary API
      const response = await fetch(`API_KEY ${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        throw new Error(`Unable to find definition for "${word}"`);
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error(`No definitions found for "${word}"`);
      }
      
      // Map the API response to our interface
      const entry = data[0];
      const result: DictionaryResult = {
        word: entry.word,
        phonetic: entry.phonetic,
        meanings: entry.meanings.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map((def: any) => ({
            definition: def.definition,
            example: def.example
          }))
        }))
      };
      
      return result;
    } catch (error) {
      console.error('Dictionary API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Unable to find definition. Please try again later.');
    }
  },
  
  renderContent(data: DictionaryResult) {
    return (
      <div className="plugin-card plugin-card-define rounded-lg p-4 text-white animate-fade-in">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{data.word}</h3>
          {data.phonetic && <span className="text-sm text-gray-300">{data.phonetic}</span>}
        </div>
        
        <div className="space-y-3">
          {data.meanings.map((meaning, i) => (
            <div key={i} className="border-t border-gray-600 pt-2">
              <span className="text-sm text-gray-300 italic">{meaning.partOfSpeech}</span>
              
              {meaning.definitions.map((def, j) => (
                <div key={j} className="mt-1">
                  <p className="text-sm">{def.definition}</p>
                  {def.example && (
                    <p className="text-xs text-gray-400 mt-1 italic">"{def.example}"</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default DictionaryPlugin;
