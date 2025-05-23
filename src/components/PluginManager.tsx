
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DynamicPluginInfo } from '@/types';
import { useChatContext } from '@/contexts/ChatContext';

interface PluginManagerProps {
  onClose: () => void;
}

const PluginManager: React.FC<PluginManagerProps> = ({ onClose }) => {
  const { addPlugin, getCustomPluginsInfo } = useChatContext();
  const [customPlugins, setCustomPlugins] = useState<DynamicPluginInfo[]>(getCustomPluginsInfo());
  const [newPlugin, setNewPlugin] = useState<DynamicPluginInfo>({
    name: '',
    description: '',
    command: '',
    pattern: '',
    enabled: true
  });

  const handleAddPlugin = () => {
    if (!newPlugin.name || !newPlugin.command) return;
    
    // Add the new plugin
    addPlugin(newPlugin);
    
    // Update local state
    setCustomPlugins(prev => {
      const exists = prev.findIndex(p => p.command === newPlugin.command);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = newPlugin;
        return updated;
      }
      return [...prev, newPlugin];
    });
    
    // Reset form
    setNewPlugin({
      name: '',
      description: '',
      command: '',
      pattern: '',
      enabled: true
    });
  };

  const togglePlugin = (plugin: DynamicPluginInfo) => {
    const updatedPlugin = { ...plugin, enabled: !plugin.enabled };
    addPlugin(updatedPlugin);
    
    setCustomPlugins(prev => 
      prev.map(p => p.command === plugin.command ? updatedPlugin : p)
    );
  };

  return (
    <div className="bg-background rounded-lg border border-border p-4 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Plugin Manager</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Plugin</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="plugin-name">Name</Label>
            <Input
              id="plugin-name"
              value={newPlugin.name}
              onChange={(e) => setNewPlugin(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Weather, Calculator, etc."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="plugin-command">Command (without /)</Label>
            <Input
              id="plugin-command"
              value={newPlugin.command}
              onChange={(e) => setNewPlugin(prev => ({ ...prev, command: e.target.value }))}
              placeholder="weather, calc, etc."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="plugin-description">Description</Label>
            <Input
              id="plugin-description"
              value={newPlugin.description}
              onChange={(e) => setNewPlugin(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Get weather information for a city"
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleAddPlugin}
            disabled={!newPlugin.name || !newPlugin.command}
            className="w-full"
          >
            Add Plugin
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Custom Plugins</h3>
        {customPlugins.length === 0 ? (
          <div className="text-muted-foreground text-sm">No custom plugins added yet</div>
        ) : (
          <div className="space-y-3">
            {customPlugins.map((plugin) => (
              <div 
                key={plugin.command}
                className="flex items-center justify-between border border-border/50 rounded-lg p-3"
              >
                <div>
                  <h4 className="font-medium">{plugin.name}</h4>
                  <p className="text-sm text-muted-foreground">/{plugin.command}</p>
                  {plugin.description && (
                    <p className="text-xs text-muted-foreground mt-1">{plugin.description}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <Switch
                    checked={plugin.enabled}
                    onCheckedChange={() => togglePlugin(plugin)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginManager;
