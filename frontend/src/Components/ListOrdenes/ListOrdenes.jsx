import React, { useEffect, useState } from "react";
import "./ListOrdenes.css";
import cross_icon from '../Assets/cross_icon.png';

const ListOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const userId = localStorage.getItem("userId"); // Obtener el id del usuario desde localStorage

  const fetchOrdenes = async () => {
    try {
      const response = await fetch(`https://proyectoasii-vultures.onrender.com/ordenes/${userId}`);
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const cancelarOrden = async (id, estado) => {
    if (estado === 4) {
      alert("No se puede cancelar una orden que ya ha sido entregada.");
      return;
    }
    try {
      await fetch(`https://proyectoasii-vultures.onrender.com/cancelarorden/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado_orden: 5 }), // Cambiar estado a "Cancelad"
      });
      fetchOrdenes(); // Actualizar la lista de órdenes después de cancelar
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  useEffect(() => {
    fetchOrdenes(); // Llamar a la API para obtener las órdenes
  }, []);

  const getEstadoTexto = (estadoId) => {
    switch (estadoId) {
      case 1: return "Pendiente";
      case 2: return "En proceso";
      case 3: return "Enviado";
      case 4: return "Entregado";
      case 5: return "Cancelado";
      default: return "Desconocido";
    }
  };

  return (
    <div className="listproduct">
      <h1>Mis Pedidos</h1>
      <div className="listproduct-format-main">
        <p>FECHA Y HORA</p>
        <p>TOTAL</p>
        <p>ESTADO</p>
      </div>
      <div className="listproduct-allordenes">
        <hr />
        {ordenes.map((orden) => (
          <div key={orden.id}>
            <div className="listproduct-format-main listproduct-format">
              <p>{orden.fecha_hora}</p>
              <p>{orden.total_orden}</p>
              <p>{getEstadoTexto(orden.estado_orden)}</p>
              {orden.estado_orden !== 4 && ( // Solo mostrar botón si no ha sido entregado
                <img
                  className="listproduct-remove-icon"
                  onClick={() => cancelarOrden(orden.id, orden.estado_orden)}
                  src={cross_icon}
                  alt="Cancelar"
                />
              )}
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOrdenes;
