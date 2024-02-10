import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await actions.login(email, password);

    if (response && response.msg === "OK") {
      // Navega a la página de perfil después del inicio de sesión exitoso
      navigate("/profile");
    } else {
      // Muestra el mensaje de error en el componente
      setError(response.msg || "Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
  } finally {
    // Restablece el estado de carga incluso si ocurre un error
    setLoading(false);
  }

  // Limpia los campos de entrada
  setEmail("");
  setPassword("");
};

  

  return (
    <div className="container-fluid text-center d-flex justify-content-center">
      <form className="containe form" onSubmit={handleLogin}>
        <div className="form-group">
          <label
            htmlFor="exampleInputEmail1"
            className="d-flex fs-4 ">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="exampleInputPassword1"
            className="d-flex fs-4"
          >
            Password
          </label>
          <input
            type="password"
            className="form-control "
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-dark mt-5"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
