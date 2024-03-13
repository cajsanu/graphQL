import { Link } from "react-router-dom";

export const NavBar = () => {
  const style = {
    padding: 5,
  };

  if (!localStorage.loggedInUser) {
    return (
      <div>
        <Link style={style} to="/books">
          Books
        </Link>
        <Link style={style} to="/authors">
          Authors
        </Link>
        <Link style={style} to="/login">
          Login
        </Link>
      </div>
    );
  }
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
    </div>
  );
};
