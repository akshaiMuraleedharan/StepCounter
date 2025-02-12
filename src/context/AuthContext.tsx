import React, { createContext, useState, ReactNode } from 'react';

interface User {
  userId?: string;
  email?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
