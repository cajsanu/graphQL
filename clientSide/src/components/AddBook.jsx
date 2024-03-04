import { useMutation } from "@apollo/client";
import { CREATE_BOOK } from "../queries";
import { useField } from "../hooks";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";
import { ALL_AUTHORS } from "../queries";
import { useNavigate } from "react-router-dom";

export const AddBook = () => {
  const title = useField("text");
  const author = useField("text");
  const published = useField("number");
  const genre = useField("text");
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate()

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error);
    },
  });

  const addBook = (event) => {
    console.log(genres);
    event.preventDefault();
    if (!title.value || !author.value || !published.value || !genres.length) {
      window.alert("All fields must be filled in");
    } else {
      createBook({
        variables: {
          title: title.value,
          author: author.value,
          published: Number(published.value),
          genres: genres,
        },
      });
      setGenres([]);
      navigate("/books")
    }
  };

  const handleGenre = () => {
    console.log(genre.value);
    setGenres((oldGenres) => [...oldGenres, genre.value]);
  };

  return (
    <div>
      <h2>Add new book</h2>
      <form onSubmit={addBook}>
        <div>
          title
          <input {...title} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          published
          <input {...published} />
        </div>
        <div>
          genres
          <input {...genre} />
          <button type="button" onClick={handleGenre}>
            add genre
          </button>
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};
