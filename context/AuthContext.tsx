import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => setTokenState(t));
  }, []);

  const setToken = async (t: string | null) => {
    setTokenState(t);
    if (t) {
      await AsyncStorage.setItem("token", t);
    } else await AsyncStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
