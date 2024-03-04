import "../App.css";
import { Link, Outlet } from "react-router-dom";

function App() {
  const style = {
    padding: 5,
  };

  return (
    <div>
      <Link style={style} to="/">
        Home
      </Link>
      <Link style={style} to="/authors">
        Authors
      </Link>
      <Link style={style} to="/books">
        Books
      </Link>
      <Link style={style} to="/newBook">
        Add new book
      </Link>
      <h1>Hello bookworms</h1>
      <p>"Today a reader, tomorrow a leader." – Margaret Fuller</p>
      <p>"A word after a word after a word is power." – Margaret Atwood</p>
      <p>
        "One glance at a book and you hear the voice of another person, perhaps
        someone dead for 1,000 years. To read is to voyage through time." – Carl
        Sagan
      </p>
      <Outlet />
    </div>
  );
}

export default App;
