export interface CloudEvent {
  id: string;
  source: string;
  type: string;
  datacontenttype?: string;
  data?: any;
  data_base64?: string;
  time?: string;
  subject?: string;
  specversion: string;
  [key: string]: any;
}

export interface Filter {
  attr: string;
  match: 'Exact' | 'Includes' | 'Prefix' | 'Suffix';
  value: string;
}

export interface AppState {
  events: CloudEvent[];
  isConnected: boolean;
  error: string | null;
  loading: boolean;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}