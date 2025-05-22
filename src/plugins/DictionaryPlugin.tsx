
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
      
      // In a real app, you would call a dictionary API here
      // This is a mock implementation for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      
      // Mock dictionary data based on the word
      const mockDefinitions: Record<string, DictionaryResult> = {
        'apple': {
          word: 'apple',
          phonetic: '/ˈæp.əl/',
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: 'A round fruit with red, green, or yellow skin and firm white flesh.',
                  example: 'She ate an apple for breakfast.'
                },
                {
                  definition: 'The tree that produces apples, with pink or white flowers.'
                }
              ]
            }
          ]
        },
        'code': {
          word: 'code',
          phonetic: '/kəʊd/',
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: 'A system of words, letters, or signs used to represent a message in secret form.',
                  example: 'They sent the message in code.'
                },
                {
                  definition: 'A system of rules and standards.',
                  example: 'The dress code requires formal attire.'
                },
                {
                  definition: 'Instructions written for computers.',
                  example: 'He writes code for a tech company.'
                }
              ]
            },
            {
              partOfSpeech: 'verb',
              definitions: [
                {
                  definition: 'To write instructions for a computer program.',
                  example: 'She spent all night coding the new feature.'
                }
              ]
            }
          ]
        }
      };
      
      // Return mock data if available, otherwise generate a random definition
      if (mockDefinitions[word.toLowerCase()]) {
        return mockDefinitions[word.toLowerCase()];
      }
      
      return {
        word: word,
        phonetic: `/ˈ${word.toLowerCase().charAt(0)}.${word.toLowerCase().slice(1)}/`,
        meanings: [
          {
            partOfSpeech: ['noun', 'verb', 'adjective'][Math.floor(Math.random() * 3)],
            definitions: [
              {
                definition: `This is a mock definition for "${word}" as we don't have a real dictionary API connected.`,
                example: `This is an example sentence using "${word}".`
              }
            ]
          }
        ]
      };
    } catch (error) {
      console.error('Dictionary error:', error);
      throw new Error('Unable to find definition. Please try again later.');
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
