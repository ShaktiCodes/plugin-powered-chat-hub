
import WeatherPlugin from './WeatherPlugin';
import CalculatorPlugin from './CalculatorPlugin';
import DictionaryPlugin from './DictionaryPlugin';
import { Plugin } from '../types';

const plugins: Plugin[] = [
  WeatherPlugin,
  CalculatorPlugin,
  DictionaryPlugin
];

export default plugins;

// Helper function to check if a message contains a plugin command
export function parsePluginCommand(message: string): { pluginName: string; params: string } | null {
  for (const plugin of plugins) {
    const match = message.match(plugin.pattern);
    if (match && match[1]) {
      return {
        pluginName: plugin.name,
        params: match[1]
      };
    }
  }
  return null;
}

// Get a plugin by name
export function getPlugin(name: string): Plugin | undefined {
  return plugins.find(plugin => plugin.name === name);
}
