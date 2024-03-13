import Authors from "../components/Authors";
import { SetBirthYear } from "../components/SetBirthYear";
import { NavBar } from "../components/NavBar";

export const AuthorsPage = () => {
  return (
    <div>
      <NavBar />
      <Authors />
      <SetBirthYear />
    </div>
  );
};
