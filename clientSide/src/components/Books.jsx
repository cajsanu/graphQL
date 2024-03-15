import { useApolloClient, useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";
import { useSubscription } from "@apollo/client";

const Book = ({ book }) => {
  return (
    <li>
      {book.title} by {book.author.name}
      <div>in {book.published}</div>
    </li>
  );
};

export const Books = ({ genre }) => {
  const client = useApolloClient()

  const bookResult = useQuery(ALL_BOOKS, {
    variables: !genre || genre === "All genres" ? {} : { genre },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`A new book called ${addedBook.title} was added to the collection`)
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    },
    onError: (error) => console.log(error),
  })

  if (bookResult.loading || bookResult.data === undefined) {
    return <div>Loading...</div>;
  }
  const books = bookResult.data.allBooks;

  return (
    <div>
      <h2>Books</h2>
      <h3>Showing books with {genre ? genre : "All genres"} </h3>
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
};
