import { useEffect, useContext } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { NavBar } from "../components/NavBar";
import TokenContext from "../../TokenContext";
import { BOOK_ADDED } from "../queries";

function App() {
  const client = useApolloClient();
  const [token, tokenDispatch] = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("token", localStorage.loggedInUser);
  }, [token]);

  if (!localStorage.loggedInUser) {
    return (
      <div>
        <NavBar />
        <h1>Hello bookworms</h1>
      </div>
    );
  }

  const handleLogout = () => {
    console.log("logout");
    tokenDispatch({ type: "NULL" });
    localStorage.clear();
    client.clearStore();
    navigate("/");
  };

  return (
    <div>
      <NavBar />
      <h1>Hello bookworms</h1>
      <p>"Today a reader, tomorrow a leader." – Margaret Fuller</p>
      <p>"A word after a word after a word is power." – Margaret Atwood</p>
      <p>
        "One glance at a book and you hear the voice of another person, perhaps
        someone dead for 1,000 years. To read is to voyage through time." – Carl
        Sagan
      </p>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default App;
