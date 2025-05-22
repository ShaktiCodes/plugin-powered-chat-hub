
import React from 'react';
import { Plugin } from '../types';

interface GeminiResponse {
  prompt: string;
  response: string;
}

const GeminiPlugin: Plugin = {
  name: 'gemini',
  description: 'Get AI-powered responses using Google Gemini',
  command: '/gemini',
  pattern: /^\/gemini\s+(.+)$/i,
  
  async execute(params: string): Promise<GeminiResponse> {
    try {
      const prompt = params.trim();
      
      if (!prompt) {
        throw new Error("Please provide a question or prompt for Gemini.");
      }
      
      // Check if user has provided API key in localStorage
      const apiKey = localStorage.getItem('geminiApiKey') || 'AIzaSyBmtI6kCzCu1NDPDt5IGhXfVyBWT7yCO0U';
      
      if (!apiKey) {
        throw new Error("Gemini API key not found. Please set your API key using /gemini-key [your-api-key]");
      }
      
      // Prepare the request to Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract the response text from the Gemini API response
      let responseText = 'No response generated.';
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        responseText = data.candidates[0].content.parts[0].text || 'Empty response from Gemini.';
      }
      
      return {
        prompt,
        response: responseText
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Error accessing Gemini API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  renderContent(data: GeminiResponse) {
    return (
      <div className="plugin-card plugin-card-gemini rounded-lg p-4 text-white animate-fade-in">
        <h3 className="text-lg font-semibold mb-2">Gemini AI Response</h3>
        <div className="flex flex-col">
          <span className="text-gray-300 mb-1">Your prompt:</span>
          <span className="text-sm mb-3 font-mono">{data.prompt}</span>
          <span className="text-gray-300 mb-1">Response:</span>
          <div className="text-sm whitespace-pre-wrap">{data.response}</div>
        </div>
      </div>
    );
  }
};

export default GeminiPlugin;
