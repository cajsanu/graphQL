import { useNavigate } from "react-router-dom";
import { AddBook } from "../components/AddBook";
import { NavBar } from "../components/NavBar";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { GET_USER } from "../queries";

export const NewBookPage = () => {
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

  return (
    <div>
      <NavBar />
      <AddBook />
    </div>
  );
};
