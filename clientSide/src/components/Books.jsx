import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Book = ({ book }) => {
  return (
    <li>
      {book.title} by {book.author.name}
      <div>in {book.published}</div>
    </li>
  );
};

export const Books = ({genre}) => {
  const bookResult =
    !genre || genre === "All genres"
      ? useQuery(ALL_BOOKS)
      : useQuery(ALL_BOOKS, {
          variables: { genre },
        });

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
