import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  username: string | null;
  setAuth: (token: string | null, userId: string | null, username: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  username: null,
  setAuth: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem('token'), AsyncStorage.getItem('userId'), AsyncStorage.getItem('username')]).then(
      ([t, id, username]) => {
        setToken(t);
        setId(id);
        setUsername(username);
        setLoading(false);
      },
    );
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

  return (
    <AuthContext.Provider value={{ token, userId: id, username, setAuth, loading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
