import ReactDOM from "react-dom/client";
import App from "./routes/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { AuthorsPage } from "./routes/AuthorsPage"; 
import { ErrorPage } from "./routes/ErrorPage"
import { BooksPage } from "./routes/BooksPage";
import { NewBookPage } from "./routes/NewBookPage";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
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
    ]
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
