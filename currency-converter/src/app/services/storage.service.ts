import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Save data to localStorage
  save(key: string, data: any): void {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(`Failed to save data for key "${key}":`, error);
    }
  }

  // Load data from localStorage
  load<T>(key: string): T | null {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      return null;
    }
    try {
      return JSON.parse(storedData) as T;
    } catch (error) {
      console.error(`Failed to parse data for key "${key}":`, error);
      return null;
    }
  }

  // Remove data from localStorage
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data for key "${key}":`, error);
    }
  }
}
