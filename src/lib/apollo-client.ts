import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { onError } from "@apollo/client/link/error";
import { createClient } from "graphql-ws";

import { STAFF_TOKEN_KEY, USER_TOKEN_KEY } from "@/lib/auth-tokens";

function bearerFromStorage(): string {
  if (typeof window === "undefined") return "";
  const staff = localStorage.getItem(STAFF_TOKEN_KEY);
  const user = localStorage.getItem(USER_TOKEN_KEY);
  const token = staff || user;
  return token ? `Bearer ${token}` : "";
}

const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_URI ||
  "https://prelura.voltislabs.uk/graphql/";

const GRAPHQL_WS_URI = process.env.NEXT_PUBLIC_GRAPHQL_WS_URI?.trim() ?? "";

const httpLink = new HttpLink({ uri: GRAPHQL_URI });

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: bearerFromStorage(),
    },
  });
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) =>
      console.error(`[GraphQL] ${message} @ ${path}`)
    );
  }
  if (networkError) console.error(`[Network] ${networkError}`);
});

function makeWsLink(): ApolloLink | null {
  if (typeof window === "undefined" || !GRAPHQL_WS_URI) return null;
  return new GraphQLWsLink(
    createClient({
      url: GRAPHQL_WS_URI,
      connectionParams: () => {
        const auth = bearerFromStorage();
        return auth ? { Authorization: auth } : {};
      },
      lazy: true,
      retryAttempts: 2,
      on: {
        error: (err) => console.warn("[GraphQL-WS]", err),
      },
    })
  );
}

const wsLink = makeWsLink();

const httpChain = from([errorLink, authLink, httpLink]);

const splitLink =
  wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpChain
      )
    : httpChain;

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
