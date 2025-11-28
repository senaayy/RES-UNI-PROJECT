import { createContext, useContext, useMemo, useState } from 'react';

const DEFAULT_USER = {
  id: 'demo-user',
  username: 'Demo User',
  email: 'demo@example.com'
};

const AuthContext = createContext({
  user: DEFAULT_USER,
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('bb-user') : null;
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  });

  const saveSession = (_, nextUser) => {
    const resolvedUser = nextUser || DEFAULT_USER;
    localStorage.setItem('bb-user', JSON.stringify(resolvedUser));
    setUser(resolvedUser);
  };

  const logout = () => {
    saveSession(null, DEFAULT_USER);
  };

  const value = useMemo(
    () => ({
      user,
      saveSession,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

