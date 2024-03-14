import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";
import { NavBar } from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Books } from "../components/Books"

export const RecommendationsPage = () => {
  const navigate = useNavigate();

  const userResult = useQuery(GET_USER);

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

  return (
    <div>
      <NavBar />
      <h2>Recommendations</h2>
      <h3>Books in your favourite genre: {faveGenre}</h3>
      <div>
        <Books genre={faveGenre}/>
      </div>
    </div>
  );
};
