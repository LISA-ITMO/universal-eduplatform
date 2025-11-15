import { createApolloClient } from '../hooks/useApollo';

// singleton Apollo client used across web/admin apps so logout can
// clear/reset the cache from a single place
export const apolloClient = createApolloClient();

export default apolloClient;
