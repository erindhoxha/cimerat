import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  username: string | null;
  setAuth: (token: string | null, userId: string | null, username: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  username: null,
  setAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then((t) => setToken(t));
    AsyncStorage.getItem('userId').then((id) => {
      setId(id);
    });
    AsyncStorage.getItem('username').then((username) => {
      setUsername(username);
    });
  }, []);

  const setAuth = async (t: string | null, userId: string | null, username: string | null) => {
    setToken(t);
    setId(userId);
    setUsername(username);
    if (t) {
      await AsyncStorage.setItem('token', t);
    } else await AsyncStorage.removeItem('token');
    if (userId) {
      await AsyncStorage.setItem('userId', userId);
    } else await AsyncStorage.removeItem('userId');
    if (username) {
      await AsyncStorage.setItem('username', username);
    } else await AsyncStorage.removeItem('username');
  };

  return <AuthContext.Provider value={{ token, userId: id, username, setAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
