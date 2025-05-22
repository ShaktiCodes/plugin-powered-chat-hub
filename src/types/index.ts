
export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  type: "text" | "plugin";
  pluginName?: "weather" | "calc" | "define";
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
