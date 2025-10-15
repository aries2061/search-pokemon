import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://graphql-pokemon2.vercel.app/',
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Pokemon: {
          keyFields: ['id'],
          fields: {
            evolutions: {
              merge(existing = [], incoming) {
                return incoming;
              }
            },
            types: {
              merge(existing = [], incoming) {
                return incoming;
              }
            },
            attacks: {
              merge(existing = {}, incoming) {
                return { ...existing, ...incoming };
              }
            }
          }
        },
        Query: {
          fields: {
            pokemons: {
              merge(existing = [], incoming) {
                return incoming;
              }
            },
            pokemon: {
              read(existing, { args, toReference }) {
                if (args?.name) {
                  // Try to find the pokemon in the cache by name
                  return existing;
                }
                return existing;
              }
            }
          }
        }
      }
    }),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      watchQuery: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  });
};

export default createApolloClient;