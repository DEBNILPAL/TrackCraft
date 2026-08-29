import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tracker_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('tracker_token');
      const storedUserStr = localStorage.getItem('tracker_user');

      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
            setToken(storedToken);
            localStorage.setItem('tracker_user', JSON.stringify(res.data.data.user));
            connectSocket();
          } else {
            logout();
          }
        } catch (err: any) {
          console.error('Session verify error:', err);
          // Only force logout if server explicitly returns 401 Unauthorized or 403 Forbidden
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          } else {
            // Server cold start / reboot / deployment: retain cached user session
            if (storedUserStr) {
              try {
                const cachedUser = JSON.parse(storedUserStr);
                setUser(cachedUser);
                setToken(storedToken);
                connectSocket();
              } catch {
                logout();
              }
            } else {
              setToken(storedToken);
            }
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('tracker_token', newToken);
    localStorage.setItem('tracker_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    connectSocket();
  };

  const logout = () => {
    localStorage.removeItem('tracker_token');
    localStorage.removeItem('tracker_user');
    setToken(null);
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('tracker_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
