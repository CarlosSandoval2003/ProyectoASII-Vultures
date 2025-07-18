import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const CartItems = () => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [shippingMethod, setShippingMethod] = useState(); 
  const [total, setTotal] = useState(3000); // Total de compra predeterminado
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumberError, setCardNumberError] = useState("");
const [cvvError, setCVVError] = useState("");
const [expiryDateError, setExpiryDateError] = useState("");
  const [addressCH, setAddressCH] = useState([]);
  const [ShippingCH, setShippingCH] = useState([]);
  const [paymentCH, setPaymentCH] = useState([]);
  const [newAddress, setNewAddress] = useState({
    direccion: "",
    estado: "",
    ciudad: "",
    codigo_postal: "",
    id_pais: ""
  });
  const [countries, setCountries] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    nombre_portador: "",
    numero_tarjeta: "",
    cvv: "",
    fecha_expiracion: ""
  });
  const [couponCode, setCouponCode] = useState(""); // Código del cupón ingresado
const [couponValid, setCouponValid] = useState(false); // Estado del cupón
const [discount, setDiscount] = useState(0); // Descuento aplicado
const [couponError, setCouponError] = useState(""); // Mensaje de error del cupón
const [couponDiscount, setCouponDiscount] = useState(0); // Descuento del cupón


  const [validExpiryDate, setValidExpiryDate] = useState(false);
  const [saldo, setSaldo] = useState("");

  const [monedas, setMonedas] = useState([]);
  const [selectedMoneda, setSelectedMoneda] = useState('');

  useEffect(() => {
    // Realiza la solicitud para obtener las monedas
    fetch('https://sturdy-roan-water.glitch.me/monedas')
      .then(response => response.json())
      .then(data => setMonedas(data))
      .catch(error => console.error('Error al obtener monedas:', error));
  }, []);

  const handleNombrePortadorChange = (e) => {
    const { value } = e.target;
    setNewPaymentMethod({ ...newPaymentMethod, nombre_portador: value });
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/paymentMethods/${userId}`);
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  useEffect(() => {
    if (userId && userId !== "0") {
      fetchPaymentMethods();
    }
  }, [userId]);

  const handleOrder = () => {
    // Lógica para enviar la solicitud al endpoint de checkout
  };

  useEffect(() => {
    
    if (userId && userId !== "0") {
      fetch(`https://plankton-app-nhztk.ondigitalocean.app/cartItems/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setDisplayedItems(data);
        });
        fetch(`https://plankton-app-nhztk.ondigitalocean.app/userAddresses/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data);
        });
        fetch(`https://plankton-app-nhztk.ondigitalocean.app/shippingMethods`)
        .then((res) => res.json())
        .then((data) => {
          setShippingMethods(data);
        });
        fetch(`https://plankton-app-nhztk.ondigitalocean.app/countries`)
        .then((res) => res.json())
        .then((data) => {
          setCountries(data);
        });
    }
  }, []);

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setNewAddress({
      direccion: "",
      estado: "",
      ciudad: "",
      codigo_postal: "",
      id_pais: ""
    });
  };

  const handleSaveAddress = () => {
    // Guardar la nueva dirección en la base de datos
    fetch(`https://plankton-app-nhztk.ondigitalocean.app/addAddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, ...newAddress }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Actualizar las direcciones mostradas después de agregar la nueva dirección
          setAddresses([...addresses, newAddress]);
          setShowAddressForm(false);
          setNewAddress({
            direccion: "",
            estado: "",
            ciudad: "",
            codigo_postal: "",
            id_pais: ""
          });
        } else {
          console.error('Error:', data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleCountryChange = (e) => {
    setNewAddress({ ...newAddress, id_pais: e.target.value });
  };

  const handleCheckout = async () => {
    
    try {
      const response = await fetch('https://plankton-app-nhztk.ondigitalocean.app/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          shippingMethod,
          cartItems: displayedItems.map(item => ({ id_item_producto: item.id, cantidad: item.cantidad })),
          couponCode
        })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error); // Mostrar mensaje de error en caso de existencias insuficientes
      } else {
        // Si todas las condiciones son exitosas, mostrar el formulario de método de pago
        console.log("EL SALDO OBTENIDO DE TODO ELPROCESO: ", parseInt(saldo).toFixed(2));
        console.log("TOTAL DE LA COMPRA: ", calculateTotal());
        if (isNaN(parseFloat(saldo))) {
          alert("ESCOGE UN METODO DE PAGO");
        } else        
        if (parseFloat(saldo) < calculateTotal()) {
          alert("SALDO INSUFICIENTE");
        } else {
          try {
            const userId = localStorage.getItem("userId");
            
            const selectedShippingMethod = ShippingCH[0];
            const selectedPaymentMethod = paymentCH[0];
            const totalCompra = calculateTotal();
            const selectedAddress = addressCH[0];
        console.log(userId, selectedAddress, selectedPaymentMethod, selectedShippingMethod, totalCompra);
            // Enviar los datos al backend
            const response = await fetch('https://plankton-app-nhztk.ondigitalocean.app/saveOrder', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId,
                direccionEnvio: selectedAddress,
                metodoEnvio: selectedShippingMethod,
                metodoPago: selectedPaymentMethod,
                totalCompra,
                couponCode
              })
            });
        
            const data = await response.json();
        
            // Manejar la respuesta del backend
            if (data.success) {
              alert("¡Orden guardada exitosamente!");
              window.location.href = "/";
            } else {
              alert("Ocurrió un error al guardar la orden.");
            }
          } catch (error) {
            console.error('Error en el proceso de checkout:', error);
            alert("Ocurrió un error al procesar el checkout.");
          }
        }

      }
    } catch (error) {
      console.error('Error en el proceso de checkout:', error);
      alert("Ocurrió un error al procesar el checkout.");
    }
  };

 
  const handleDecrement = (itemId) => {
    // Update displayedItems locally
    setDisplayedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      
    );

    // Update quantity on the server
    fetch(`https://plankton-app-nhztk.ondigitalocean.app/cartItems/updateQuantity/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation: "decrement" }),
    })
      .catch((error) => console.error("Error:", error));
  };

  const handleIncrement = (itemId) => {
    // Update displayedItems locally
    setDisplayedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );

    // Update quantity on the server
    fetch(`https://plankton-app-nhztk.ondigitalocean.app/cartItems/updateQuantity/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation: "increment" }),
    })
      .catch((error) => console.error("Error:", error));

      
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
    setShippingCH([e.target.value]);
    console.log(ShippingCH);
    const selectedMethod = shippingMethods.find(method => method.id === parseInt(e.target.value));
  if (selectedMethod) {
    switch (selectedMethod.id) {
      case 1:
        setDeliveryTime("De 4 a 5 días de entrega");
        break;
      case 2:
        setDeliveryTime("De 1 a 2 días de entrega");
        break;
      case 3:
        setDeliveryTime("De 1 a 3 días de entrega");
        break;
      default:
        setDeliveryTime("");
        break;
    }
  }
  };

  const handleAddressChange = (e) => {
    setShippingMethod(e.target.value);
    setAddressCH([e.target.value]);
    console.log(addressCH);
    
  };

  const handleRemoveItem = async (userId, itemId) => {
    try {
      const response = await fetch('https://plankton-app-nhztk.ondigitalocean.app/removeCartItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, itemId })
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Actualizar los ítems mostrados después de la eliminación
        const updatedItems = displayedItems.filter(item => item.id !== itemId);
        setDisplayedItems(updatedItems);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCancelPayment = () => {
    // Limpiar los campos del formulario
    setNewPaymentMethod({
      nombre_portador: "",
      numero_tarjeta: "",
      cvv: "",
      fecha_expiracion: ""
    });
    setShowPaymentForm(false);
  };

  const calculateTotal = () => {
    // Sumar los totales de todos los ítems del carrito
    const itemsTotal = displayedItems.reduce((total, item) => {
      return total + ((item.precio - (item.precio * (item.descuento / 100))) * item.cantidad);
    }, 0);
  
    // Obtener el precio del método de envío escogido
    const selectedMethod = shippingMethods.find(method => method.id === parseInt(shippingMethod));
    const shippingPrice = selectedMethod ? selectedMethod.precio : 0;
  
    // Sumar el precio del método de envío al total de la compra
    let total = itemsTotal + shippingPrice;
  
    // Aplicar el descuento del cupón
    if (couponDiscount > 0) {
      total -= (total * couponDiscount / 100); // Aplicar el descuento
    }
  
    return total.toFixed(2); // Retornar el total formateado
  };
  
  
  

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethodId = event.target.value;
    setPaymentCH([event.target.value]);
    console.log(paymentCH);
    // Llamar al backend para obtener el saldo asociado
    fetch('https://plankton-app-nhztk.ondigitalocean.app/checkoutSaldo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        paymentMethodId: selectedPaymentMethodId // Enviar el ID del método de pago seleccionado
      })
    })
    .then(response => response.json())
    .then(data => {
      setSaldo(data.saldo);
      console.log('Saldo:', data.saldo); // Mostrar el saldo en la consola o actualizar la interfaz de usuario
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  // Función para validar el formulario del nuevo método de pago
  const validatePaymentMethod = () => {
    const { numero_tarjeta, cvv, fecha_expiracion } = newPaymentMethod;
  
    // Validar que el número de tarjeta tenga solo números y tenga exactamente 16 dígitos
    const isValidCardNumber = /^\d{16}$/.test(numero_tarjeta);
  
    // Validar que el CVV tenga solo números y tenga exactamente 3 dígitos
    const isValidCVV = /^\d{3}$/.test(cvv);
  
    // Validar la fecha de expiración
    const isValidDate = validateExpiryDate(fecha_expiracion);
  
    return isValidCardNumber && isValidCVV && isValidDate;
  };
  
  // Función para validar la fecha de expiración
  const validateExpiryDate = (value) => {
    // Validar que la fecha tenga el formato MM/YY
    const isValidFormat = /^\d{2}\/\d{2}$/.test(value);
    if (!isValidFormat) {
      setValidExpiryDate(false);
      return false;
    }
  
    // Extraer el mes y el año de la fecha de expiración
    const [month, year] = value.split("/");
    const currentYear = new Date().getFullYear() % 100; // Obtener los últimos dos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // Obtener el mes actual
  
    // Validar que el mes esté en el rango de 01 a 12
    const isValidMonth = parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;
  
    // Validar que el año sea mayor o igual al año actual si el mes es mayor que el actual
    const isValidYear = parseInt(year, 10) >= currentYear || parseInt(month, 10) > currentMonth;
  
    // Actualizar el estado de la validez de la fecha de expiración
    const isValid = isValidMonth && isValidYear;
    setValidExpiryDate(isValid);
  
    return isValid;
  };
  
  const handleSavePaymentMethod = async () => {
    // Validar el formulario del método de pago
    const isValid = validatePaymentMethod();
  
    if (isValid) {
      const { numero_tarjeta, cvv, fecha_expiracion } = newPaymentMethod;
  
      // Realizar la consulta a la base de datos
      try {
        const response = await fetch('https://plankton-app-nhztk.ondigitalocean.app/checkCreditCard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ numero_tarjeta, cvv, fecha_expiracion })
        });
  
        const data = await response.json();
  
        if (data.exists) {
          // Insertar los datos del método de pago en la base de datos
          try {
            const saveResponse = await fetch('https://plankton-app-nhztk.ondigitalocean.app/savePaymentMethod', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                userId,
                numero_tarjeta, 
                cvv, 
                nombre_portador: newPaymentMethod.nombre_portador, 
                fecha_expiracion 
              })
            });
  
            const saveData = await saveResponse.json();
  
            if (saveData.success) {
              alert("Tarjeta agregada con éxito");
              // Limpiar los campos del formulario después del éxito
              setNewPaymentMethod({
                nombre_portador: "",
                numero_tarjeta: "",
                cvv: "",
                fecha_expiracion: ""
              });
              fetchPaymentMethods();
  
              // Cerrar el formulario (aquí puedes manejar el estado para mostrar/ocultar el formulario)
              setShowPaymentForm(false);
            } else {
              console.error('Error al guardar el método de pago:', saveData.error);
              alert("Ocurrió un error al guardar el método de pago.");
            }
          } catch (error) {
            console.error('Error al guardar el método de pago:', error);
            alert("Ocurrió un error al guardar el método de pago.");
          }
        } else {
          alert("La tarjeta ingresada no existe");
        }
      } catch (error) {
        console.error('Error al verificar la tarjeta:', error);
        alert("Ocurrió un error al verificar la tarjeta.");
      }
    } else {
      alert("Por favor, completa todos los campos correctamente.");
    }
  };
  
  const handleVerifyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Por favor, ingresa un código de cupón.");
      return;
    }
  
    try {
      const response = await fetch('https://plankton-app-nhztk.ondigitalocean.app/verifyCoupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: couponCode })
      });
  
      const data = await response.json();
  
      if (!data.success) {
        setCouponError(data.message); // Mostrar mensaje de error específico del backend
      } else {
        // Si el cupón es válido
        setCouponError(""); // Limpiar cualquier error
        setCouponValid(true); // Cambia el estado del cupón a válido
        setDiscount(data.descuento_porcentaje); // Establece el porcentaje de descuento
        setCouponDiscount(data.descuento_porcentaje); 
        const newTotal = calculateTotal();
        setTotal(newTotal); 
      }
    } catch (error) {
      console.error("Error al verificar el cupón:", error);
      setCouponError("Ocurrió un error al verificar el cupón.");
    }
  };
  
  

// Función para manejar el cambio en el número de tarjeta
const handleCardNumberChange = (e) => {
  const { value } = e.target;
  // Validar que solo se ingresen números y que no exceda los 16 dígitos
  if (/^\d{0,16}$/.test(value)) {
    setNewPaymentMethod({ ...newPaymentMethod, numero_tarjeta: value });
    // Validar la longitud del número de tarjeta
    if (value.length < 16) {
      setCardNumberError("Número de tarjeta incompleto");
    } else {
      setCardNumberError("");
    }
  }
};

// Función para manejar el cambio en el CVV
const handleCVVChange = (e) => {
  const { value } = e.target;
  // Validar que solo se ingresen números y que no exceda los 3 dígitos
  if (/^\d{0,3}$/.test(value)) {
    setNewPaymentMethod({ ...newPaymentMethod, cvv: value });
    // Validar la longitud del CVV
    if (value.length < 3) {
      setCVVError("CVV incompleto");
    } else {
      setCVVError("");
    }
  }
};

// Función para manejar el cambio en la fecha de expiración
const handleExpiryDateChange = (e) => {
  let { value } = e.target;
  // Validar que solo se ingresen números y que se agregue automáticamente el "/"
  if (/^\d{0,2}(\/)?(\d{0,2})?$/.test(value)) {
    // Agregar automáticamente el "/" después de ingresar los primeros dos dígitos
    if (/^\d{2}$/.test(value)) {
      value += "/";
    }
    // Validar la fecha de expiración
    const [month, year] = value.split("/");
    const currentYear = new Date().getFullYear() % 100; // Obtener los últimos dos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // Obtener el mes actual
    if (parseInt(month, 10) < currentMonth && parseInt(year, 10) <= currentYear || parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
      setExpiryDateError("Fecha Incorrecta");
    } else {
      setExpiryDateError("");
    }
    // Actualizar el estado de la fecha de expiración
    setNewPaymentMethod({ ...newPaymentMethod, fecha_expiracion: value });
  }
};

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Imagen</p>
        <p>Producto</p>
        <p>Precio</p>
        <p>Cantidad</p>
        <p>Descuento</p>
        <p>Total</p>
        <p>Eliminar</p>
      </div>
      <hr />
      {displayedItems.map((item) => (
        <div key={item.id}>
          <div className="cartitems-format-main cartitems-format">
            <img
              className="cartitems-product-icon"
              src={item.imagen_producto1}
              alt=""
            />
            <p>{item.nombre_producto}</p>
            <p>Q.{(item.precio).toFixed(2)}</p>
            <div>
              <button
                onClick={() => handleDecrement(item.id)}
                disabled={item.cantidad <= 1}
              >
                -
              </button>
              <p>{item.cantidad}</p>
              <button onClick={() => handleIncrement(item.id)}>+</button>
            </div>
            <p>{item.descuento}%</p>
            <p>Q.{((item.precio - (item.precio * (item.descuento/100))) * item.cantidad).toFixed(2)}</p>
            <button
              onClick={() => {
                handleRemoveItem(userId, item.id);
              }}
              className="cartitems-remove-icon"
            >
              <img src={cross_icon} alt="" />
            </button>
          </div>
          <hr />
        </div>
      ))}
      {showAddressForm && (
        <div>
          <h3>Nueva Dirección</h3>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={newAddress.direccion}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Estado:</label>
            <input
              type="text"
              name="estado"
              value={newAddress.estado}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Ciudad:</label>
            <input
              type="text"
              name="ciudad"
              value={newAddress.ciudad}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Código Postal:</label>
            <input
              type="text"
              name="codigo_postal"
              value={newAddress.codigo_postal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>País:</label>
            <select value={newAddress.id_pais} onChange={handleCountryChange}>
              <option value="">Seleccionar País</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.nombre_pais}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={handleSaveAddress}>Guardar</button>
            <button onClick={handleCancelAddress}>Cancelar</button>
          </div>
        </div>
      )}
      {/* Elementos adicionales para la dirección y checkout */}
      <div className="additional-elements">
        Dirección:   
        <select value={address} onChange={handleAddressChange}>
        <option value="">Selecciona tu Dirección</option>
          {addresses.map((address, index) => (
            <option key={index} value={address.id}>{`${address.ciudad}, ${address.direccion}`}</option>
            
          ))}
        </select>
        <button onClick={handleAddNewAddress}>Agregar Nueva Dirección</button>
        <div>
          <label>
            Método de Envío:
            <select value={shippingMethod} onChange={handleShippingMethodChange}>
            <option value="">Seleccionar un Metodo de Envio</option>
              {shippingMethods.map((method, index) => (
                <option key={index} value={method.id}>{`${method.nombre} - Q.${method.precio}`}</option>
              ))}
            </select>
            {deliveryTime}
          </label>
        </div>
        <div>
          <label>Total de la Compra:</label>
          <input type="text" value={`Q.${calculateTotal()}`} readOnly />
        </div>
        <div>
          <label>
            Métodos de Pago:
            <select name="paymentMethod" onChange={handlePaymentMethodChange}>
            <option value="">Selecciona un Metodo de Pago</option>
              {paymentMethods.map((method, index) => (
                <option key={index} value={method.id}>
                  {`No. Tarjeta: ${method.numero_tarjeta}, Portador: ${method.nombre_portador}`}
                </option>
              ))}
            </select>
            <button onClick={() => setShowPaymentForm(true)}>Agregar Nuevo Método de Pago</button>
          </label>
          {showPaymentForm && (
            <div>
              <h3>Nuevo Método de Pago</h3>
              <div>
                <label>Nombre del Portador:</label>
                <input
                  type="text"
                  name="nombre_portador"
                  value={newPaymentMethod.nombre_portador}
                  onChange={handleNombrePortadorChange}
                />
              </div>
              <div>
  <label>Número de Tarjeta:</label>
  <input
    type="text"
    name="numero_tarjeta"
    value={newPaymentMethod.numero_tarjeta}
    onChange={handleCardNumberChange}
  />
  {cardNumberError && <p>{cardNumberError}</p>}
</div>
<div>
  <label>CVV:</label>
  <input
    type="text"
    name="cvv"
    value={newPaymentMethod.cvv}
    onChange={handleCVVChange}
  />
  {cvvError && <p>{cvvError}</p>}
</div>
<div>
  <label>Fecha de Expiración (MM/YY):</label>
  <input
    type="text"
    name="fecha_expiracion"
    value={newPaymentMethod.fecha_expiracion}
    onChange={handleExpiryDateChange}
  />
  {expiryDateError && <p>{expiryDateError}</p>}
</div>
<div>
          <label htmlFor="moneda">Moneda:</label>
          <select
            id="moneda"
            value={selectedMoneda}
            onChange={(e) => setSelectedMoneda(e.target.value)}
          >
            <option value="">Selecciona una moneda</option>
            {monedas.map((moneda) => (
              <option key={moneda.id} value={moneda.simbolo}>
                {moneda.nombre} ({moneda.simbolo})
              </option>
            ))}
          </select>
        </div>
<div>
<button onClick={handleSavePaymentMethod} disabled={cardNumberError || cvvError || expiryDateError}>Guardar</button>
                <button onClick={handleCancelPayment}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
        <div>
  <label>Ingresar cupón:</label>
  <input
    type="text"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    placeholder="Ingresa tu cupón"
    disabled={couponValid} // Bloquea el campo si el cupón es válido
  />
  <button onClick={handleVerifyCoupon} disabled={couponValid}>
    VERIFICAR
  </button>
  {couponValid && <p>Cupón válido. Descuento: {discount}%</p>}
  {couponError && <p>{couponError}</p>}
</div>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );

};

export default CartItems;
