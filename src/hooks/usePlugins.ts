
import { useState, useEffect } from 'react';
import { Plugin, DynamicPluginInfo } from '../types';
import defaultPlugins from '../plugins';

export const usePlugins = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([...defaultPlugins]);
  
  useEffect(() => {
    // Load custom plugins from localStorage
    const storedPlugins = localStorage.getItem('customPlugins');
    if (storedPlugins) {
      try {
        const customPluginsInfo: DynamicPluginInfo[] = JSON.parse(storedPlugins);
        
        // Convert stored plugin info to actual plugins
        const customPlugins = customPluginsInfo
          .filter(p => p.enabled)
          .map(pluginInfo => ({
            name: pluginInfo.name,
            description: pluginInfo.description,
            command: pluginInfo.command,
            pattern: new RegExp(`^\\/${pluginInfo.command}\\s+(.+)$`, 'i'),
            execute: async (params: string) => {
              return {
                query: params,
                response: `Custom plugin "${pluginInfo.name}" executed with: ${params}`
              };
            },
            renderContent: (data: any) => (
              <div className="plugin-card plugin-card-custom rounded-lg p-4 text-white animate-fade-in">
                <h3 className="text-lg font-semibold mb-2">{pluginInfo.name}</h3>
                <div className="flex flex-col">
                  <span className="text-gray-300 mb-1">Query:</span>
                  <span className="text-sm mb-3">{data.query}</span>
                  <span className="text-gray-300 mb-1">Response:</span>
                  <span className="text-sm">{data.response}</span>
                </div>
              </div>
            )
          }));
        
        setPlugins([...defaultPlugins, ...customPlugins]);
      } catch (error) {
        console.error('Failed to load custom plugins:', error);
      }
    }
  }, []);
  
  const addPlugin = (pluginInfo: DynamicPluginInfo) => {
    // Save to localStorage
    const storedPlugins = localStorage.getItem('customPlugins');
    let customPlugins: DynamicPluginInfo[] = [];
    
    if (storedPlugins) {
      try {
        customPlugins = JSON.parse(storedPlugins);
      } catch (error) {
        console.error('Failed to parse stored plugins:', error);
      }
    }
    
    // Check if plugin with this command already exists
    const existingPluginIndex = customPlugins.findIndex(
      p => p.command === pluginInfo.command
    );
    
    if (existingPluginIndex >= 0) {
      customPlugins[existingPluginIndex] = pluginInfo;
    } else {
      customPlugins.push(pluginInfo);
    }
    
    localStorage.setItem('customPlugins', JSON.stringify(customPlugins));
    
    // Update plugins state
    if (pluginInfo.enabled) {
      const newPlugin: Plugin = {
        name: pluginInfo.name,
        description: pluginInfo.description,
        command: pluginInfo.command,
        pattern: new RegExp(`^\\/${pluginInfo.command}\\s+(.+)$`, 'i'),
        execute: async (params: string) => {
          return {
            query: params,
            response: `Custom plugin "${pluginInfo.name}" executed with: ${params}`
          };
        },
        renderContent: (data: any) => (
          <div className="plugin-card plugin-card-custom rounded-lg p-4 text-white animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">{pluginInfo.name}</h3>
            <div className="flex flex-col">
              <span className="text-gray-300 mb-1">Query:</span>
              <span className="text-sm mb-3">{data.query}</span>
              <span className="text-gray-300 mb-1">Response:</span>
              <span className="text-sm">{data.response}</span>
            </div>
          </div>
        )
      };
      
      setPlugins(prev => {
        // Remove any existing plugin with the same name
        const filtered = prev.filter(p => 
          p.name !== pluginInfo.name || 
          defaultPlugins.some(dp => dp.name === p.name)
        );
        return [...filtered, newPlugin];
      });
    } else {
      // If disabled, remove from active plugins
      setPlugins(prev => 
        prev.filter(p => 
          p.name !== pluginInfo.name || 
          defaultPlugins.some(dp => dp.name === p.name)
        )
      );
    }
  };
  
  const getPlugins = () => plugins;
  
  const getCustomPluginsInfo = (): DynamicPluginInfo[] => {
    const storedPlugins = localStorage.getItem('customPlugins');
    if (storedPlugins) {
      try {
        return JSON.parse(storedPlugins);
      } catch (error) {
        console.error('Failed to parse stored plugins:', error);
        return [];
      }
    }
    return [];
  };
  
  return {
    plugins,
    addPlugin,
    getPlugins,
    getCustomPluginsInfo
  };
};
