import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Book = ({ book }) => {
  return (
    <li>
      {book.title} by {book.author.name}
      <div>in {book.published}</div>
      <div>genres: {book.genres}</div>
    </li>
  );
};

export const Books = () => {
  const result = useQuery(ALL_BOOKS);

  if (result.loading || result.data === undefined) {
    return <div>Loading...</div>;
  }
  const books = result.data.allBooks;

  return (
    <div>
      <h2>Books</h2>
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
};
