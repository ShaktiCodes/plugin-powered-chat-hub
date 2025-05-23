
import WeatherPlugin from './WeatherPlugin';
import CalculatorPlugin from './CalculatorPlugin';
import DictionaryPlugin from './DictionaryPlugin';
import GeminiPlugin from './GeminiPlugin';
import GeminiKeyPlugin from './GeminiKeyPlugin';
import { Plugin } from '../types';

const defaultPlugins: Plugin[] = [
  WeatherPlugin,
  CalculatorPlugin,
  DictionaryPlugin,
  GeminiPlugin,
  GeminiKeyPlugin
];

export default defaultPlugins;

// These functions are kept for backward compatibility
// but they should be used from usePlugins hook for dynamic plugin support
export function parsePluginCommand(message: string, plugins: Plugin[] = defaultPlugins): { pluginName: string; params: string } | null {
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

export function getPlugin(name: string, plugins: Plugin[] = defaultPlugins): Plugin | undefined {
  return plugins.find(plugin => plugin.name === name);
}
