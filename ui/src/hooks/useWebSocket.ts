import { useEffect, useRef, useCallback } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { CloudEvent } from '../types';
import { useApp } from '../contexts/AppContext';

// Global WebSocket manager to survive React Strict Mode
class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private ws: ReconnectingWebSocket | null = null;
  private isConnected = false;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private callbacks: {
    onEvent: ((event: CloudEvent) => void)[];
    onConnected: ((connected: boolean) => void)[];
    onError: ((error: string | null) => void)[];
  } = {
    onEvent: [],
    onConnected: [],
    onError: []
  };

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  addCallbacks(callbacks: {
    onEvent: (event: CloudEvent) => void;
    onConnected: (connected: boolean) => void;
    onError: (error: string | null) => void;
  }) {
    this.callbacks.onEvent.push(callbacks.onEvent);
    this.callbacks.onConnected.push(callbacks.onConnected);
    this.callbacks.onError.push(callbacks.onError);
    
    // Send current state to new callback
    callbacks.onConnected(this.isConnected);
  }

  removeCallbacks(callbacks: {
    onEvent: (event: CloudEvent) => void;
    onConnected: (connected: boolean) => void;
    onError: (error: string | null) => void;
  }) {
    this.callbacks.onEvent = this.callbacks.onEvent.filter(cb => cb !== callbacks.onEvent);
    this.callbacks.onConnected = this.callbacks.onConnected.filter(cb => cb !== callbacks.onConnected);
    this.callbacks.onError = this.callbacks.onError.filter(cb => cb !== callbacks.onError);
  }

  connect() {
    console.log('WebSocketManager: Connect called, current state:', this.ws?.readyState);
    
    if (this.isConnected || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocketManager: Already connected or connecting, skipping');
      return;
    }

    if (this.ws) {
      const oldWs = this.ws;
      this.ws = null;
      oldWs.close();
    }

    try {
      const wsUrl = `ws://localhost:8080/ws`;
      console.log('WebSocketManager: Connecting to:', wsUrl);

      this.ws = new ReconnectingWebSocket(wsUrl, [], {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 4000,
        maxRetries: Infinity,
        debug: true
      });

      this.ws.onopen = () => {
        console.log('WebSocketManager: Connected successfully');
        this.isConnected = true;
        this.callbacks.onConnected.forEach(cb => cb(true));
        this.callbacks.onError.forEach(cb => cb(null));
      };

      this.ws.onmessage = (event) => {
        try {
          let data = event.data;
          let parseAttempts = 0;
          const maxAttempts = 3;
          
          while (typeof data === 'string' && parseAttempts < maxAttempts) {
            try {
              const parsed = JSON.parse(data);
              parseAttempts++;
              
              if (typeof parsed === 'string' && parsed === data) {
                break;
              }
              
              data = parsed;
              
              if (typeof data === 'object' && data !== null) {
                break;
              }
            } catch (parseErr) {
              console.error('JSON parse error:', parseErr);
              break;
            }
          }
          
          if (data && typeof data === 'object' && !Array.isArray(data) && data !== null) {
            console.log('📨 Received CloudEvent:', data.id, data.type);
            this.callbacks.onEvent.forEach(cb => cb(data as CloudEvent));
          } else {
            console.warn('Invalid CloudEvent format:', typeof data);
          }
        } catch (err) {
          console.error('WebSocket message processing error:', err);
          this.callbacks.onError.forEach(cb => cb('Failed to parse incoming message'));
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocketManager: Disconnected, code:', event.code, 'reason:', event.reason);
        this.isConnected = false;
        this.callbacks.onConnected.forEach(cb => cb(false));
      };

      this.ws.onerror = (error) => {
        console.error('WebSocketManager: Error:', error);
        this.isConnected = false;
        this.callbacks.onError.forEach(cb => cb('WebSocket connection error'));
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      this.callbacks.onError.forEach(cb => cb('Failed to create WebSocket connection'));
    }
  }

  disconnect() {
    console.log('WebSocketManager: Disconnect called');
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.callbacks.onConnected.forEach(cb => cb(false));
  }
}

export function useWebSocket() {
  const { addEvent, setConnected, setError } = useApp();
  const managerRef = useRef<WebSocketManager | null>(null);
  const callbacksRef = useRef({
    onEvent: addEvent,
    onConnected: setConnected,
    onError: setError
  });

  // Update callbacks ref when they change
  callbacksRef.current = {
    onEvent: addEvent,
    onConnected: setConnected,
    onError: setError
  };

  // Initialize manager on first use
  if (!managerRef.current) {
    managerRef.current = WebSocketManager.getInstance();
  }

  const connect = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.disconnect();
    }
  }, []);

  // Register callbacks with manager
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.addCallbacks(callbacksRef.current);
      
      // Auto-connect on first mount
      console.log('useWebSocket: Auto-connecting on mount');
      managerRef.current.connect();

      return () => {
        if (managerRef.current) {
          managerRef.current.removeCallbacks(callbacksRef.current);
        }
      };
    }
  }, []); // Empty deps - only run once

  return { connect, disconnect };
}