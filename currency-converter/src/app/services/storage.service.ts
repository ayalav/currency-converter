import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
 // Save data to localStorage
 save(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load data from localStorage
load<T>(key: string): T | null {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) as T : null;
}

// Remove data from localStorage
remove(key: string): void {
  localStorage.removeItem(key);
}
}
