import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CloudEvent, AppState, Filter } from '../types';

interface AppContextType extends AppState {
  addEvent: (event: CloudEvent) => void;
  clearEvents: () => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
}

type AppAction =
  | { type: 'ADD_EVENT'; payload: CloudEvent }
  | { type: 'CLEAR_EVENTS' }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Filter[] };

const initialState: AppState & { filters: Filter[] } = {
  events: [],
  isConnected: false,
  error: null,
  loading: false,
  filters: [],
};

function appReducer(state: typeof initialState, action: AppAction): typeof initialState {
  switch (action.type) {
    case 'ADD_EVENT':
      // Prevent duplicate events by checking if event with same ID already exists
      const eventExists = state.events.some(event => 
        event.id === action.payload.id && 
        event.source === action.payload.source &&
        event.type === action.payload.type
      );
      
      if (eventExists) {
        console.log('Duplicate event detected, skipping:', action.payload.id);
        return state;
      }
      
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case 'CLEAR_EVENTS':
      return {
        ...state,
        events: [],
      };
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value: AppContextType = {
    ...state,
    addEvent: (event: CloudEvent) => dispatch({ type: 'ADD_EVENT', payload: event }),
    clearEvents: () => dispatch({ type: 'CLEAR_EVENTS' }),
    setConnected: (connected: boolean) => dispatch({ type: 'SET_CONNECTED', payload: connected }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setFilters: (filters: Filter[]) => dispatch({ type: 'SET_FILTERS', payload: filters }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}