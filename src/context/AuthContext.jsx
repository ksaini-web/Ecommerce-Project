import { createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const readStoredAuth = (key) => {
  const rawAuth = localStorage.getItem(key);
  if (!rawAuth) return null;

  try {
    return JSON.parse(rawAuth);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const withRole = (payload, role) => ({
  ...(payload[role] || payload.user || payload.seller || payload),
  token: payload.token,
  role: payload.role || role.toUpperCase(),
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (localStorage.getItem('token') ? readStoredAuth('user_auth') : null));
  const [seller, setSeller] = useState(() => (localStorage.getItem('sellerToken') ? readStoredAuth('seller_auth') : null));

  const loginUser = useCallback((userData) => {
    const authUser = withRole(userData, 'user');

    setUser(authUser);
    setSeller(null);
    localStorage.setItem('token', authUser.token);
    localStorage.setItem('role', 'USER');
    localStorage.setItem('user_auth', JSON.stringify(authUser));
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerId');
    localStorage.removeItem('seller_auth');
  }, []);

  const loginSeller = useCallback((sellerData) => {
    const authSeller = withRole(sellerData, 'seller');

    setSeller(authSeller);
    setUser(null);
    localStorage.setItem('sellerToken', authSeller.token);
    localStorage.setItem('role', 'SELLER');
    if (authSeller.id) localStorage.setItem('sellerId', authSeller.id);
    localStorage.setItem('seller_auth', JSON.stringify(authSeller));
    localStorage.removeItem('token');
    localStorage.removeItem('user_auth');
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_auth');
  }, []);

  const logoutSeller = useCallback(() => {
    setSeller(null);
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerId');
    localStorage.removeItem('role');
    localStorage.removeItem('seller_auth');
  }, []);

  const value = useMemo(
    () => ({
      user,
      seller,
      isUserLoggedIn: Boolean(user || readStoredAuth('user_auth')),
      isSellerLoggedIn: Boolean(seller || readStoredAuth('seller_auth')),
      login: loginUser,
      loginUser,
      loginSeller,
      logoutUser,
      logoutSeller,
    }),
    [loginSeller, loginUser, logoutSeller, logoutUser, seller, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

