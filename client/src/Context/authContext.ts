import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
