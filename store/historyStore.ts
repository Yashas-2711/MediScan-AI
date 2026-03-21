import { useState, useCallback } from 'react';
import { MedicineInfo } from '@/services/geminiService';

export interface HistoryItem {
  id: string;
  imageUri: string;
  medicine: MedicineInfo;
  scannedAt: Date;
}

// Simple in-memory store (can be replaced with AsyncStorage for persistence)
let globalHistory: HistoryItem[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(fn => fn());
};

export const historyStore = {
  getAll: (): HistoryItem[] => [...globalHistory].reverse(),

  add: (item: Omit<HistoryItem, 'id' | 'scannedAt'>): HistoryItem => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      scannedAt: new Date(),
    };
    globalHistory.push(newItem);
    notifyListeners();
    return newItem;
  },

  remove: (id: string): void => {
    globalHistory = globalHistory.filter(item => item.id !== id);
    notifyListeners();
  },

  clear: (): void => {
    globalHistory = [];
    notifyListeners();
  },

  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },
};

export function useHistory() {
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate(n => n + 1), []);

  useState(() => {
    const unsub = historyStore.subscribe(refresh);
    return unsub;
  });

  return {
    history: historyStore.getAll(),
    addToHistory: historyStore.add,
    removeFromHistory: historyStore.remove,
    clearHistory: historyStore.clear,
  };
}
