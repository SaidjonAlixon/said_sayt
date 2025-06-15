import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { 
  initializeDefaultData, 
  getUsers, 
  saveUsers, 
  getPasswords, 
  savePasswords, 
  getCurrentUser, 
  saveCurrentUser 
} from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default data
    initializeDefaultData();
    
    // Check if user is logged in
    const savedUser = getCurrentUser();
    if (savedUser) {
      // Verify user still exists in users list and get latest data
      const users = getUsers();
      const userExists = users.find((u: any) => u.id === savedUser.id);
      if (userExists) {
        setUser(userExists);
        saveCurrentUser(userExists); // Update with latest data
      } else {
        // User was deleted, clear current user
        saveCurrentUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const refreshUser = () => {
    if (user) {
      const users = getUsers();
      const updatedUser = users.find((u: any) => u.id === user.id);
      if (updatedUser) {
        setUser(updatedUser);
        saveCurrentUser(updatedUser);
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getUsers();
      const passwords = getPasswords();
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && passwords[email] === password) {
        if (foundUser.isBlocked) {
          return false; // User is blocked
        }
        
        setUser(foundUser);
        saveCurrentUser(foundUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getUsers();
      const passwords = getPasswords();
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === data.email);
      if (existingUser) {
        return false; // User already exists
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: 'student',
        isBlocked: false,
        freeTestUsed: false,
        testAttempts: 0,
        maxTestAttempts: 1, // Only free test initially
        allowedDirections: [],
        createdAt: new Date().toISOString(),
        achievements: [],
        totalScore: 0,
        rank: 0
      };

      const updatedUsers = [...users, newUser];
      const updatedPasswords = { ...passwords, [data.email]: data.password };
      
      saveUsers(updatedUsers);
      savePasswords(updatedPasswords);
      
      setUser(newUser);
      saveCurrentUser(newUser);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};