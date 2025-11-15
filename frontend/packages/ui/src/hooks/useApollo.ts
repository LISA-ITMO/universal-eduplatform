import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken, setAccessToken } from '../lib/token';
import { onError } from '@apollo/client/link/error';

// Single-flight refresh promise to avoid concurrent refresh requests
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessTokenViaCookie = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const clientId = import.meta.env.VITE_CLIENT_ID || 'web';
      const res = await fetch(import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-client-id': clientId },
        body: JSON.stringify({ query: 'mutation RefreshToken { refreshToken }' }),
      });

      const json = await res.json();
      const newToken = json?.data?.refreshToken;
      return newToken ?? null;
    } catch (e) {
      return null;
    } finally {
      // reset after settled
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
  credentials: 'include', // send cookies (refresh token) with requests
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  const clientId = import.meta.env.VITE_CLIENT_ID || 'web';
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-client-id': clientId,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Do not attempt refresh for refreshToken/logout operations
  const opName = operation.operationName;
  const ctx = operation.getContext() as any;
  if (opName === 'RefreshToken' || opName === 'Logout' || ctx?.isRetry) {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
    return;
  }

  // Detect authentication errors and attempt silent refresh + retry (one-time)
  const isAuthError = (graphQLErrors && graphQLErrors.some((e) => {
    const code = (e as any).extensions?.code;
    return e.message?.toLowerCase().includes('unauthorized') || code === 'UNAUTHENTICATED';
  })) || (networkError && (networkError as any).statusCode === 401);

  if (isAuthError) {
    // Try to refresh access token using refreshToken cookie (single-flight)
    return new Observable((observer) => {
      (async () => {
        try {
          const newToken = await refreshAccessTokenViaCookie();
          if (!newToken) {
            observer.error(new Error('Unable to refresh token'));
            return;
          }

          // store token in memory
          setAccessToken(newToken);

          // mark retry to avoid loops
          operation.setContext({ isRetry: true });

          // update operation context with new header and retry
          operation.setContext(({ headers = {} }: any) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }));

          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          };

          forward(operation).subscribe(subscriber);
        } catch (err) {
          observer.error(err);
        }
      })();
    });
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
};
