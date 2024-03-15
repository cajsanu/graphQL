import ReactDOM from "react-dom/client";
import App from "./routes/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { setContext } from "@apollo/client/link/context";
import { AuthorsPage } from "./routes/AuthorsPage";
import { ErrorPage } from "./routes/ErrorPage";
import { BooksPage } from "./routes/BooksPage";
import { NewBookPage } from "./routes/NewBookPage";
import { LoginPage } from "./routes/LoginPage";
import { TokenContextProvider } from "../TokenContext";
import { RecommendationsPage } from "./routes/RecommendationsPage";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("loggedInUser");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "books",
    element: <BooksPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "authors",
    element: <AuthorsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "newBook",
    element: <NewBookPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "recommendations",
    element: <RecommendationsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <TokenContextProvider>
      <RouterProvider router={router} />
    </TokenContextProvider>
  </ApolloProvider>
);
