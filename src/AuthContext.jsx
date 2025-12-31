import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (e) {
      return null;
    }
  });
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const saveTokens = (t, rt) => {
    setToken(t || null);
    setRefreshToken(rt || null);
    try {
      if (t) localStorage.setItem('token', t);
      else localStorage.removeItem('token');
      if (rt) localStorage.setItem('refreshToken', rt);
      else localStorage.removeItem('refreshToken');
    } catch (e) {}
  };

  const saveUserInfo = (u) => {
    setUserInfo(u || null);
    try {
      if (u) localStorage.setItem('userInfo', JSON.stringify(u));
      else localStorage.removeItem('userInfo');
    } catch (e) {}
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Login failed');
      }
      const data = await res.json();
      // Expecting response with `email`, `first_name`, `last_name`, `token`, `refresh_token`
      const t = data.token || data.jwt || data.accessToken;
      const rt = data.refreshToken || data.refresh_token || data.refresh;
      if (!t) throw new Error('No token returned from server');
      saveTokens(t, rt);
      const ui = data.user || {
        email: data.email || null,
        first_name: data.first_name || data.firstName || null,
        last_name: data.last_name || data.lastName || null,
      };
      saveUserInfo(ui.email ? ui : null);
      return t;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    saveTokens(null, null);
    saveUserInfo(null);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) throw new Error('No refresh token available');
    const res = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      throw new Error('Failed to refresh token');
    }
    const data = await res.json();
    const t = data.token || data.jwt || data.accessToken;
    const rt = data.refreshToken || data.refresh_token || data.refresh;
    if (!t) throw new Error('No token returned from refresh');
    saveTokens(t, rt || refreshToken);
    return t;
  };

  const authFetch = async (input, init = {}) => {
    const makeRequest = async (tok) => {
      const headers = new Headers(init.headers || {});
      if (tok) headers.set('Authorization', `Bearer ${tok}`);
      const body = init.body;
      const opts = { ...init, headers };
      return fetch(input, opts);
    };

    let resp = await makeRequest(token);
    if (resp.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        resp = await makeRequest(newToken);
      } catch (e) {
        logout();
        throw e;
      }
    }
    return resp;
  };

  useEffect(() => {
    // place for background token refresh or expiry handling
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        userInfo,
        login,
        logout,
        loading,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
