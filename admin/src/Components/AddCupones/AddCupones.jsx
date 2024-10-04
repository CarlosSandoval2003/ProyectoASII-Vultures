import React, { useState } from "react";
import "./AddCupones.css";

const AddCupones = () => {
  const [cuponDetails, setCuponDetails] = useState({
    codigo: "",
    descuento_porcentaje: "",
    fecha_expiracion: "",
    uso_maximo: 1,
    uso_actual: 0
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCuponDetails({ ...cuponDetails, [name]: value });
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch("https://proyectoasii-vultures.onrender.com/addcupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuponDetails),
      });

      const data = await response.json();
      if (data.success) {
        alert("Cupón agregado correctamente");

        // Limpiar los campos después de un registro exitoso
        setCuponDetails({
          codigo: "",
          descuento_porcentaje: "",
          fecha_expiracion: "",
          uso_maximo: 1,
          uso_actual: 0
        });
      } else {
        // Mostrar mensaje de error si el código ya existe
        alert(data.message || "Error al agregar el cupón");
      }
    } catch (error) {
      console.error("Error al agregar el cupón:", error);
      alert("Error al agregar el cupón");
    }
  };

  return (
    <div className="addcupon">
      <div className="addcupon-itemfield">
        <p>Código del cupón</p>
        <input
          type="text"
          name="codigo"
          value={cuponDetails.codigo}
          onChange={handleInputChange}
          placeholder="Ingrese el código del cupón"
        />
      </div>
      <div className="addcupon-itemfield">
        <p>Descuento (%)</p>
        <input
          type="number"
          name="descuento_porcentaje"
          value={cuponDetails.descuento_porcentaje}
          onChange={handleInputChange}
          placeholder="Ingrese el porcentaje de descuento"
        />
      </div>
      <div className="addcupon-itemfield">
        <p>Fecha de expiración</p>
        <input
          type="date"
          name="fecha_expiracion"
          value={cuponDetails.fecha_expiracion}
          onChange={handleInputChange}
        />
      </div>
      <div className="addcupon-itemfield">
        <p>Uso máximo</p>
        <input
          type="number"
          name="uso_maximo"
          value={cuponDetails.uso_maximo}
          onChange={handleInputChange}
        />
      </div>
      <button className="addcupon-btn" onClick={handleGuardar}>
        AÑADIR CUPÓN
      </button>
    </div>
  );
};

export default AddCupones;
