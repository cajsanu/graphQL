import Select from "react-select";
import { useField } from "../hooks";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_BIRTHYEAR } from "../queries";
import { ALL_AUTHORS } from "../queries";

export const SetBirthYear = () => {
  const [name, setName] = useState(null);
  const year = useField("");
  const [addBirthYear] = useMutation(ADD_BIRTHYEAR);
  const result = useQuery(ALL_AUTHORS);

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
