import { useQuery } from "@apollo/client";
import { ALL_BOOKS, GET_USER } from "../queries";
import { NavBar } from "../components/NavBar";
import { Books } from "../components/Books";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const RecommendationsPage = () => {
  const userResult = useQuery(GET_USER);
  const navigate = useNavigate();

  const user = userResult?.data?.me;

  useEffect(() => {
    if (!userResult.loading && !user) {
      navigate("/");
    }
  }, [user, userResult.loading, navigate]);

  if (userResult.loading || userResult.data === undefined) {
    return <div>Loading...</div>;
  }
  if (!userResult.data.me) {
    return null;
  }

  const faveGenre = user.favoriteGenre;

  //   const booksResult = useQuery(ALL_BOOKS, {
  //     variables: { faveGenre },
  //   });

  //   if (booksResult.loading || booksResult.data === undefined) {
  //     return <div>Loading...</div>;
  //   }

  //   const books = booksResult.data.allBooks
  //   console.log(books);

  return (
    <div>
      <NavBar />
      <h2>Recommendations</h2>
      Books in your favourite genre: {""}
      {faveGenre}
      <div>
        <Books faveGenre={faveGenre} />
      </div>
    </div>
  );
};
