import { useField } from "../hooks";
import { useEffect, useContext } from "react";
import { LOGIN } from "../queries";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../TokenContext";

export const LoginForm = () => {
  const username = useField("text");
  const password = useField("password");
  const navigate = useNavigate();
  const [token, tokenDispatch] = useContext(TokenContext);

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      tokenDispatch({ type: "SET", payload: token });
      localStorage.setItem("loggedInUser", token);
      navigate("/")
    }
  }, [result.data]);

  const handleLogin = (event) => {
    event.preventDefault();
    console.log("login");
    login({
      variables: { username: username.value, password: password.value },
    })
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input {...username} />
        </div>
        <div>
          Password
          <input {...password} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};
