// LocalStorage utility functions
import { defaultUsers, defaultPasswords, defaultDirections, defaultNotifications } from '../data/defaultData';

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'testblok_users',
  PASSWORDS: 'testblok_passwords',
  CURRENT_USER: 'testblok_current_user',
  DIRECTIONS: 'testblok_directions',
  TEST_RESULTS: 'testblok_test_results',
  PAYMENTS: 'testblok_payments',
  NOTIFICATIONS: 'testblok_notifications',
  SUPPORT_TICKETS: 'testblok_support_tickets'
};

// Initialize default data
export const initializeDefaultData = () => {
  // Initialize users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Initialize passwords
  if (!localStorage.getItem(STORAGE_KEYS.PASSWORDS)) {
    localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(defaultPasswords));
  }

  // Initialize directions
  if (!localStorage.getItem(STORAGE_KEYS.DIRECTIONS)) {
    localStorage.setItem(STORAGE_KEYS.DIRECTIONS, JSON.stringify(defaultDirections));
  }

  // Initialize notifications
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifications));
  }

  // Initialize empty arrays for other data
  if (!localStorage.getItem(STORAGE_KEYS.TEST_RESULTS)) {
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify([]));
  }
};

// Generic localStorage functions
export const getFromStorage = <T>(key: string, defaultValue: T = [] as T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// Specific data access functions
export const getUsers = () => getFromStorage(STORAGE_KEYS.USERS, []);
export const saveUsers = (users: any[]) => saveToStorage(STORAGE_KEYS.USERS, users);

export const getPasswords = () => getFromStorage(STORAGE_KEYS.PASSWORDS, {});
export const savePasswords = (passwords: Record<string, string>) => saveToStorage(STORAGE_KEYS.PASSWORDS, passwords);

export const getCurrentUser = () => getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
export const saveCurrentUser = (user: any) => saveToStorage(STORAGE_KEYS.CURRENT_USER, user);

export const getDirections = () => getFromStorage(STORAGE_KEYS.DIRECTIONS, []);
export const saveDirections = (directions: any[]) => saveToStorage(STORAGE_KEYS.DIRECTIONS, directions);

export const getTestResults = () => getFromStorage(STORAGE_KEYS.TEST_RESULTS, []);
export const saveTestResults = (results: any[]) => saveToStorage(STORAGE_KEYS.TEST_RESULTS, results);

export const getPayments = () => getFromStorage(STORAGE_KEYS.PAYMENTS, []);
export const savePayments = (payments: any[]) => saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

export const getNotifications = () => getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
export const saveNotifications = (notifications: any[]) => saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);

export const getSupportTickets = () => getFromStorage(STORAGE_KEYS.SUPPORT_TICKETS, []);
export const saveSupportTickets = (tickets: any[]) => saveToStorage(STORAGE_KEYS.SUPPORT_TICKETS, tickets);

// Clear all data (for testing/reset)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeDefaultData();
};