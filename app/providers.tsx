'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql-pokemon2.vercel.app/',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}