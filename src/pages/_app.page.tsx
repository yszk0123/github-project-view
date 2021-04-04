import './_app.css';

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { getSession, SessionProvider } from 'next-auth/react';

import { Auth } from '../utils/Auth';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  return {
    headers: {
      ...headers,
      authorization: session ? `Bearer ${session.accessToken}` : '',
    },
  };
});

const client = new ApolloClient({
  // uri: 'https://api.github.com/graphql',
  // headers: session?.accessToken
  //   ? {
  //       Authorization: `Bearer ${session.accessToken}`,
  //     }
  //   : undefined,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <Head>
          <title>Viewer</title>
          <meta content="Viewer" name="description" />
          <link href="/favicon.ico" rel="icon" />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/0.6.1/frappe-gantt.css"
            rel="stylesheet"
          />
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/0.6.1/frappe-gantt.min.js"></script>
        </Head>
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </ApolloProvider>
    </SessionProvider>
  );
}
