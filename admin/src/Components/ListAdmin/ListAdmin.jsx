import React, { useEffect, useState } from "react";
import "./ListAdmin.css";

const ListAdmin = () => {
  const [usuariosTipo1, setUsuariosTipo1] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener los usuarios de tipo 1
  const fetchUsuarios = async () => {
    try {
      let url = 'https://plankton-app-nhztk.ondigitalocean.app/verAdmins';
      if (searchTerm.trim() !== '') {
        url = `https://plankton-app-nhztk.ondigitalocean.app/searchAdmin?search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
  
      // Verificar si la respuesta tiene éxito y contiene un array de admins
      if (data.success && Array.isArray(data.admins)) {
        setUsuariosTipo1(data.admins);
      } else {
        setUsuariosTipo1([]); // Si no hay admins, establecer un array vacío
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setUsuariosTipo1([]); // En caso de error, establecer un array vacío
    }
  };
  

  // Ejecutar fetchUsuarios cuando el componente se monta y cuando cambia el término de búsqueda
  useEffect(() => {
    fetchUsuarios();
  }, [searchTerm]);

  // Función para eliminar un usuario
  const handleDelete = async (id) => {
    try {
      await fetch('https://plankton-app-nhztk.ondigitalocean.app/eliminarAdmin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      // Actualizar la lista después de eliminar
      setUsuariosTipo1(usuariosTipo1.filter(usuario => usuario.id !== id));
    } catch (error) {
      console.error('Error deleting usuario:', error);
    }
  };

  return (
    <div className="listusuarios">
      <h1>Lista de Usuarios Tipo 1</h1>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="listusuarios-format-main">
        <p>NOMBRE</p>
        <p>APELLIDO</p>
        <p>CORREO</p>
        <p>TELÉFONO</p>
        <p>ACCIONES</p> {/* Columna para los botones de acción */}
      </div>
      <div className="listusuarios-allusuarios">
        <hr />
        {usuariosTipo1.map((usuario) => (
          <div key={usuario.id}>
            <div className="listusuarios-format-main listusuarios-format">
              <p>{usuario.nombre}</p>
              <p>{usuario.apellido}</p>
              <p>{usuario.correo}</p>
              <p>{usuario.telefono}</p>
              <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAdmin;
