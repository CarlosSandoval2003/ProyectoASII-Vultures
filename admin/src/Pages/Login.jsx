import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setcontrasena] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://plankton-app-nhztk.ondigitalocean.app/loginAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });
      const data = await response.json();
      if (data.success) {
        // Si el inicio de sesión es exitoso, llama a la función onLogin con el ID del usuario
        onLogin(data.userId);
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className='login'>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='correo'>Correo electrónico:</label>
          <input type='email' id='correo' value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label htmlFor='contrasena'>contrasena:</label>
          <input type='password' id='contrasena' value={contrasena} onChange={(e) => setcontrasena(e.target.value)} required />
        </div>
        <button type='submit'>Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
