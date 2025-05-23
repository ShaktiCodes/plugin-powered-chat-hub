
export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  type: "text" | "plugin";
  pluginName?: string;
  pluginData?: any;
  timestamp: string;
}

export interface Plugin {
  name: string;
  description: string;
  command: string;
  pattern: RegExp;
  execute: (params: string) => Promise<any>;
  renderContent: (data: any) => React.ReactNode;
}

export interface DynamicPluginInfo {
  name: string;
  description: string;
  command: string;
  pattern: string;
  enabled: boolean;
}
