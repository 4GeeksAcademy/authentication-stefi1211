import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const myToken = localStorage.getItem("authToken");

    if (!myToken) {
      console.log("Token inválido");
      navigate("/");
    } else {
      console.log("Token válido");
      // Puedes llamar a la función privada para obtener datos del perfil aquí si es necesario
      fetchProfileData();
    }
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Llama a la función privada para obtener datos del perfil
      const response = await actions.private();

      if (response) {
        // Maneja los datos del perfil como sea necesario
        console.log("Profile data:", response);
      } else {
        console.log("Error fetching profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Call the logout function with the provided email and password
      const response = await actions.logout();

      if (response && response.msg === "Logout successful") {
        // Navigate to the login page after successful logout
        navigate("/");
        console.log("Logout successful");
      } else {
        // Handle other cases if needed
        console.log("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Reset loading state even if an error occurs
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-dark vh-100">
      <button
        className="btn btn-danger d-flex ms-auto"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
      <div>
        {/* Mostrar mensaje de bienvenida con el nombre de usuario */}
        {store.user && <p>Welcome, {store.user.username}!</p>}
      </div>
      {/* Renderizar datos del perfil aquí */}
      {loading ? (
        <p>Loading profile data...</p>
      ) : (
        <div>
          <p>Email: {store.user.email}</p>
          {/* Agregar más información de perfil según sea necesario */}
        </div>
      )}
    </div>
  );
};
