import { useState } from "react";
import { Books } from "../components/Books";
import { NavBar } from "../components/NavBar";
import { ALL_GENRES } from "../queries";
import { useQuery } from "@apollo/client";

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

export const BooksPage = () => {
  const [genre, setGenre] = useState(null);
  
  const genreResult = useQuery(ALL_GENRES)

  if (genreResult.data === undefined || genreResult.loading) {
    return <div>Loading...</div>;
  }

  const genres = genreResult.data.allGenres

  return (
    <div>
      <NavBar />
      <Books genre={genre}/>
      <h3>Genres</h3>
      {genres.map((g) => (
        <Genre setGenre={setGenre} key={g} genre={g} />
      ))}
    </div>
  );
};
