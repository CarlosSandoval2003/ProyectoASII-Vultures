import React, { useEffect, useState } from "react";
import "./ListCupones.css";
import cross_icon from '../Assets/cross_icon.png';
import editboton from '../Assets/edit-boton.png';

const ListCupones = () => {
  const [allCupones, setAllCupones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCupones = async () => {
    try {
      let url = 'https://plankton-app-nhztk.ondigitalocean.app/allcupones'; // Cambiar endpoint para obtener cupones
      if (searchTerm.trim() !== '') {
        url = `https://plankton-app-nhztk.ondigitalocean.app/searchcupon?search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setAllCupones(data);
    } catch (error) {
      console.error('Error fetching cupones:', error);
    }
  };

  useEffect(() => {
    fetchCupones();
  }, [searchTerm]);

  const removeCupon = async (codigo) => {
    try {
      await fetch('https://plankton-app-nhztk.ondigitalocean.app/removecupon', { // Cambiar endpoint para eliminar cupones
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: codigo }), // Eliminar cupón por su código
      });
      fetchCupones(); // Refrescar la lista de cupones
    } catch (error) {
      console.error('Error removing cupon:', error);
    }
  };

  return (
    <div className="listcupon">
      <h1>Lista de Cupones</h1>
      <input
        type="text"
        placeholder="Buscar cupón..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="listcupon-format-main">
        <p>CÓDIGO</p>
        <p>DESCUENTO (%)</p>
        <p>FECHA DE EXPIRACIÓN</p>
        <p>USO MÁXIMO</p>
        <p>USO ACTUAL</p>
      </div>
      <div className="listcupon-allcupones">
        <hr />
        {allCupones.map((cupon) => (
          <div key={cupon.codigo}>
            <div className="listcupon-format-main listcupon-format">
              <p>{cupon.codigo}</p>
              <p>{cupon.descuento_porcentaje}</p>
              <p>{cupon.fecha_expiracion}</p>
              <p>{cupon.uso_maximo}</p>
              <p>{cupon.uso_actual}</p>
              <img className="listcupon-remove-icon" onClick={() => removeCupon(cupon.codigo)} src={cross_icon} alt="Eliminar" />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCupones;
