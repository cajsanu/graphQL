import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import { ADD_BIRTHYEAR } from "../queries";
import { useField } from "../hooks";
import Select from "react-select";
import { useState } from "react";

const Authors = () => {
  const [name, setName] = useState(null);
  const year = useField("");
  const result = useQuery(ALL_AUTHORS);
  const [addBirthYear] = useMutation(ADD_BIRTHYEAR);
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
  const names = authors.map((a) => a.name);
  const options = names.map((n) => ({ value: n, label: n }));

  const handleBirtYear = () => {
    console.log(names);
    if (names.includes(name)) {
      addBirthYear({ variables: { name: name, year: Number(year.value) } });
    } else {
      window.alert("Author not found");
    }
  };

  const handleNameChange = (event) => {
    console.log(event.value);
    setName(event.value);
  };

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
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={handleBirtYear}>
        <Select
          defaultValue={name}
          onChange={handleNameChange}
          options={options}
        />
        Year
        <input {...year} />
        <button type="submit">Update birthyear</button>
      </form>
    </div>
  );
};

export default Authors;
