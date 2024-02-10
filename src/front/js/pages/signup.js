import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await actions.signup(email, username, name, password);
setError(response.msg || "Signup failed");


      if (response && response.msg === "Registrado correctamente") {
        // Redirige al componente de inicio de sesión después del registro exitoso
        navigate("/login");
      } else {
        setError(response.msg || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }

    // Limpia los campos de entrada
    setEmail("");
    setUsername("");
    setName("");
    setPassword("");
  };
    

  return (
    <div className="container-fluid text-center d-flex justify-content-center">
    <form className="container form" onSubmit={handleSignup}>
        <div className="form-group">
          <label
            htmlFor="exampleInputEmail1"
            className="d-flex fs-4"
          >
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
            htmlFor="exampleInputUsername"
            className="d-flex fs-4"
          >
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputUsername"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="exampleInputName"
            className="d-flex fs-4"
          >
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputName"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button
          type="submit"
          className="btn btn-dark mt-5"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};
