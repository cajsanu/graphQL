import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_GENRES } from "../queries";
import { useEffect, useState } from "react";

const Genre = ({ genre, setGenre }) => {
  const handleGenre = (event) => {
    setGenre(event.target.value);
  };
  return (
    <div>
      <button onClick={handleGenre} value={genre}>
        {genre}
      </button>
    </div>
  );
};

const Book = ({ book }) => {
  return (
    <li>
      {book.title} by {book.author.name}
      <div>in {book.published}</div>
    </li>
  );
};

export const Books = ({ faveGenre }) => {
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    if (faveGenre) {
      setGenre(faveGenre)
    }
  }, [faveGenre])

  const bookResult =
    !genre || genre === "All genres"
      ? useQuery(ALL_BOOKS)
      : useQuery(ALL_BOOKS, {
          variables: { genre },
        });

  const genreResult = useQuery(ALL_GENRES)

  if (bookResult.loading || bookResult.data === undefined || genreResult.loading) {
    return <div>Loading...</div>;
  }
  const books = bookResult.data.allBooks;
  const genres = genreResult.data.allGenres
  console.log(genres)


  return (
    <div>
      <h2>Books</h2>
      <h3>Showing books with {genre ? genre : "All genres"} </h3>
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
      <h3>Genres</h3>
      {genres.map((g) => (
        <Genre setGenre={setGenre} key={g} genre={g} />
      ))}
    </div>
  );
};
