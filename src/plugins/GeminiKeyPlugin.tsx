
import React from 'react';
import { Plugin } from '../types';

interface GeminiKeyResponse {
  message: string;
}

const GeminiKeyPlugin: Plugin = {
  name: 'gemini-key',
  description: 'Set your Gemini API key',
  command: '/gemini-key',
  pattern: /^\/gemini-key\s+(.+)$/i,
  
  async execute(params: string): Promise<GeminiKeyResponse> {
    try {
      const apiKey = params.trim();
      
      if (!apiKey) {
        throw new Error("Please provide a valid Gemini API key.");
      }
      
      // Store API key in localStorage
      localStorage.setItem('geminiApiKey', apiKey);
      
      return {
        message: "Gemini API key has been set successfully. You can now use /gemini [prompt] to interact with Gemini AI."
      };
    } catch (error) {
      console.error('Error setting Gemini API key:', error);
      throw new Error(`Failed to set Gemini API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  renderContent(data: GeminiKeyResponse) {
    return (
      <div className="plugin-card plugin-card-gemini-key rounded-lg p-4 text-white animate-fade-in">
        <h3 className="text-lg font-semibold mb-2">Gemini API Key</h3>
        <div className="flex flex-col">
          <span className="text-sm">{data.message}</span>
        </div>
      </div>
    );
  }
};

export default GeminiKeyPlugin;
