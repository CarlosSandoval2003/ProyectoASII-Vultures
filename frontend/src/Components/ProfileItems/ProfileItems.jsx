import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom
import "./ProfileItems.css";
import profile_icon from '../Assets/profile-icon.png';

const ProfileItems = () => {
  const [user, setUser] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:4000/user/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return (
    <div className="profile-page">
      <h1>Perfil de Usuario</h1>
      <img src={profile_icon} alt='profile' />
      <div className="profile-info">
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Apellido:</strong> {user.apellido}</p>
        <p><strong>Correo:</strong> {user.correo}</p>
        <p><strong>Teléfono:</strong> {user.telefono}</p>
      </div>
      {/* Botón usando Link para redirigir a la página de pedidos */}
      <Link to="/listordenes" className="order-button">
        Mis Pedidos
      </Link>
    </div>
  );
};

export default ProfileItems;
