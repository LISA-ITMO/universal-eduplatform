import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { createApolloClient, refreshAccessTokenViaCookie } from './useApollo';
import { setAccessToken, getAccessToken } from '../lib/token';
import { getAuthState, setAuthStateGlobal, subscribeAuth, AuthState as GlobalAuthState } from '../lib/authStore';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing?: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => ({ ...getAuthState() }));

  useEffect(() => {
    // If we already have an access token in memory, skip silent refresh.
    const existingToken = getAccessToken();
    if (existingToken) {
      // We already have a token, so we're authenticated — clear initializing flag.
      const newState: GlobalAuthState = { user: null, token: existingToken, isAuthenticated: true, initializing: false };
      setAuthStateGlobal(newState);
      setAuthState(newState);
      return;
    }

    // Try to silently refresh access token using refresh token cookie.
    const tryRefresh = async () => {
      try {
        const newToken = await refreshAccessTokenViaCookie();
        if (newToken) {
          // store in memory
          setAccessToken(newToken);

          // fetch current user
          const clientWithToken = createApolloClient();
          const meRes = await clientWithToken.query({
            query: gql`
              query Me {
                me {
                  id
                  username
                  email
                  role
                }
              }
            `,
            fetchPolicy: 'network-only',
          });

          const me = meRes?.data?.me;
          if (me) {
            // store user only in memory (avoid localStorage for sensitive info)
            setAuthState({ token: newToken, user: me, isAuthenticated: true, initializing: false });
          } else {
            setAuthState((s) => ({ ...s, token: newToken, isAuthenticated: true, initializing: false }));
          }
        } else {
          setAccessToken(null);
          setAuthState({ user: null, token: null, isAuthenticated: false, initializing: false });
        }
      } catch (e) {
        // no-op: not authenticated
        setAccessToken(null);
        setAuthState({ user: null, token: null, isAuthenticated: false, initializing: false });
      }
    };

    tryRefresh();
    // subscribe to global auth changes so other hook instances update
    const unsub = subscribeAuth((s) => setAuthState({ ...s }));
    return () => unsub();
  }, []);

  const login = async (token: string, user: User): Promise<void> => {
    // Store access token in memory and user in state only.
    const newState: AuthState = { token, user, isAuthenticated: true, initializing: false };
    setAccessToken(token);
    setAuthStateGlobal(newState);
    setAuthState(newState);
    return;
  };

  const logout = async () => {
    // Call server to clear refresh cookie
    try {
      const client = createApolloClient();
      await client.mutate({
        mutation: gql`
          mutation Logout {
            logout
          }
        `,
      });
    } catch (e) {
      // ignore errors
    }

    // Clear client-side state
    setAccessToken(null);
    const newState: AuthState = { user: null, token: null, isAuthenticated: false, initializing: false };
    setAuthStateGlobal(newState);
    setAuthState(newState);
  };

  // If we are marked as authenticated but don't have a user object, try to fetch it.
  useEffect(() => {
    let mounted = true;
    const ensureUser = async () => {
      if (authState.isAuthenticated && !authState.user) {
        try {
          const client = createApolloClient();
          const meRes = await client.query({
            query: gql`
              query Me {
                me {
                  id
                  username
                  email
                  role
                }
              }
            `,
            fetchPolicy: 'network-only',
          });

          const me = meRes?.data?.me;
          if (mounted) {
            if (me) {
              const newState: AuthState = { token: authState.token, user: me, isAuthenticated: true, initializing: false };
              setAuthStateGlobal(newState);
              setAuthState(newState);
            }
          }
        } catch (e) {
          // ignore
        }
      }
    };

    ensureUser();
    return () => {
      mounted = false;
    };
  }, [authState.isAuthenticated, authState.user]);

  return {
    ...authState,
    login,
    logout,
  };
};




