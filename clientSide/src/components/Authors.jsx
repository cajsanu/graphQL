import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "10vh",
  };

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const authors = result.data.allAuthors;
  console.log(authors)

  return (
    <div>
      <h2>Authors</h2>
      <table style={style}>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.books.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
