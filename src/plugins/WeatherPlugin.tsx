
import React from 'react';
import { Plugin } from '../types';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

const WeatherPlugin: Plugin = {
  name: 'weather',
  description: 'Get weather information for a city',
  command: '/weather',
  pattern: /^\/weather\s+(.+)$/i,
  
  async execute(params: string): Promise<WeatherData> {
    try {
      // In a real app, you would call an actual weather API here
      // This is a mock implementation for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      
      const city = params.trim();
      
      // Mock weather data
      return {
        city: city,
        temperature: Math.floor(Math.random() * 30) + 5,
        description: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Stormy'][Math.floor(Math.random() * 5)],
        humidity: Math.floor(Math.random() * 60) + 30,
        windSpeed: Math.floor(Math.random() * 30) + 5
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  },
  
  renderContent(data: WeatherData) {
    return (
      <div className="plugin-card plugin-card-weather rounded-lg p-4 text-white animate-fade-in">
        <h3 className="text-lg font-semibold mb-2">Weather in {data.city}</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{data.temperature}°C</span>
            <span className="text-sm">{data.description}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div>
              <div className="text-gray-300">Humidity</div>
              <div>{data.humidity}%</div>
            </div>
            <div>
              <div className="text-gray-300">Wind</div>
              <div>{data.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default WeatherPlugin;
