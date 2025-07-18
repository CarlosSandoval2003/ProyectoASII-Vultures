import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { AuthContext } from "../../App";

const ProductDisplay = (props) => {
  const { addToCart } = useContext(ShopContext); // Obtener el estado de inicio de sesión del contexto
  const [variationOptions1, setVariationOptions1] = useState([]);
  const [variationOptions2, setVariationOptions2] = useState([]);
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [addToCartDisabled, setAddToCartDisabled] = useState(false);
  const [price, setPrice] = useState(null); // Estado para almacenar el precio del producto
  const { isLoggedIn, handleLogin, handleLogout } = useContext(AuthContext);
  const userId = localStorage.getItem("userId");
  const { cartItemCount } = useContext(ShopContext);
  const [tipos, setTipos] = useState([]);
  const [mainImage, setMainImage] = useState(props.image1);
  const [smallImages, setSmallImages] = useState([props.image2, props.image3]);

  const handleImageClick = (image) => {
    // Intercambiar la imagen clickeada con la imagen principal
    setSmallImages((prevImages) => {
      const newSmallImages = prevImages.filter((img) => img !== image);
      return [mainImage, ...newSmallImages];
    });
    setMainImage(image);
  };

  useEffect(() => {
    // Actualizar la interfaz de usuario cuando cambie cartItemCount
  }, [cartItemCount]);

  useEffect(() => {
    // Fetch para obtener las opciones del primer option list
    fetch(`https://plankton-app-nhztk.ondigitalocean.app/firstOption/${props.id}`)
      .then(response => response.json())
      .then(data => {
        setVariationOptions1(data.variationOptions1 || []);
        setTipos(data.variationTypes || []);
      })
      .catch(error => console.error('Error fetching first options:', error));
  }, [props.id]);

  useEffect(() => {
    console.log(tipos);
    // Si se selecciona una opción en el primer option list, realizar el fetch para obtener las opciones del segundo option list
    if (selectedOption1) {
      if (tipos.length > 1) {
        fetch(`https://plankton-app-nhztk.ondigitalocean.app/secondOption/${selectedOption1}/${props.id}`)
          .then(response => response.json())
          .then(data => {
            setVariationOptions2(data.variationOptions2 || []);
          })
          .catch(error => console.error('Error fetching second options:', error));
      } else {
        // Si no hay opciones para el segundo select, obtener el precio directamente
        const opcion2 = "0";
        fetch(`https://plankton-app-nhztk.ondigitalocean.app/configurationProduct/${selectedOption1}/${opcion2}/${props.id}`)
          .then(response => response.json())
          .then(data => {
            setPrice(data.price); // Establecer el precio del producto
          })
          .catch(error => console.error('Error fetching price:', error));
      }
    } else {
      // Si no hay ninguna opción seleccionada en el primer option list, restablecer las opciones del segundo a un array vacío
      setVariationOptions2([]);
    }
  }, [selectedOption1, props.id, tipos]);

  const handleSelectOption1 = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption1(selectedValue);

    // Restablecer las opciones del segundo select a un array vacío
    setVariationOptions2([]);
  };

  const handleSelectOption2 = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption2(selectedValue);

    // Verificar disponibilidad utilizando el nuevo endpoint en el servidor
    fetch(`https://plankton-app-nhztk.ondigitalocean.app/checkAvailability/${props.id}/${selectedValue}/${selectedOption1}`)
      .then(response => response.json())
      .then(data => {
        if (data.available) {
          setAvailabilityMessage("");
          setAddToCartDisabled(false); // Habilitar el botón de "ADD TO CART"
        } else {
          setAvailabilityMessage("Esta combinación está agotada. Por favor, elige otra opción.");
          setAddToCartDisabled(true); // Deshabilitar el botón de "ADD TO CART"
        }
      })
      .catch(error => console.error('Error checking availability:', error));
  };

  const handleAddToCart = async () => {
    if (!selectedOption1) {
      window.alert("Debes seleccionar una opción en el primer tipo de variación.");
      return; // Detener la ejecución si el primer option list no tiene una opción seleccionada
    }

    // Si el segundo option list no está vacío y no tiene una opción seleccionada, mostrar una alerta
    if (variationOptions2.length > 0 && !selectedOption2) {
      window.alert("Debes seleccionar una opción en el segundo tipo de variación.");
      return; // Detener la ejecución si el segundo option list no tiene una opción seleccionada
    }

    // Si se ha pasado todas las validaciones, continuar con agregar al carrito
    if (isLoggedIn) {
      console.log("SI HAY SESION INICIADA");
    } else {
      // Mostrar un mensaje de alerta antes de redirigir al usuario al login
      window.alert("Debes iniciar sesión para comprar.");
    }

    try {
      // Verificar si hay un carrito existente para el usuario actual
      console.log("ID DE USUARIO QUE VA AL BACKEND: ", userId);
      const cartResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/cart/${userId}`);
      const cartData = await cartResponse.json();

      let cartId;
      // Si no hay un carrito existente, crear uno nuevo
      if (!cartData.cartExists) {
        const newCartResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const newCartData = await newCartResponse.json();
        cartId = newCartData.cartId;
      } else {
        cartId = cartData.cartId;
      }

      console.log("TIPOS EN ADD CARRITO:", tipos);
      // Buscar en la tabla CONFIGURACION_PRODUCTO los registros que coincidan con las opciones seleccionadas
      if (tipos.length > 1) {
        const configurationResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/configurationProduct/${selectedOption1}/${selectedOption2}/${props.id}`);
        const configurationData = await configurationResponse.json();
        const itemId = configurationData.itemId;
        console.log(itemId, cartId);

        // Insertar un nuevo registro en la tabla CARRITO_ITEM o actualizar la cantidad si ya existe
        const cartItemResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/cartItem/${cartId}/${itemId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        });
        const cartItemData = await cartItemResponse.json();
        if (cartItemData.success) {
          console.log("Producto agregado al carrito con éxito.");
          window.location.reload();
        } else {
          console.error("Error al agregar producto al carrito.");
        }
      } else {
        const configurationResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/configurationProduct/${selectedOption1}/0/${props.id}`);
        const configurationData = await configurationResponse.json();
        const itemId = configurationData.itemId;
        console.log(itemId, cartId);

        // Insertar un nuevo registro en la tabla CARRITO_ITEM o actualizar la cantidad si ya existe
        const cartItemResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/cartItem/${cartId}/${itemId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        });
        const cartItemData = await cartItemResponse.json();
        if (cartItemData.success) {
          console.log("Producto agregado al carrito con éxito.");
          window.location.reload();
        } else {
          console.error("Error al agregar producto al carrito.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Nueva función para manejar "LO DESEO"
  const handleAddToWishlist = async () => {
    if (!selectedOption1) {
      window.alert("Debes seleccionar una opción en el primer tipo de variación.");
      return; // Detener la ejecución si el primer option list no tiene una opción seleccionada
    }

    // Si el segundo option list no está vacío y no tiene una opción seleccionada, mostrar una alerta
    if (variationOptions2.length > 0 && !selectedOption2) {
      window.alert("Debes seleccionar una opción en el segundo tipo de variación.");
      return; // Detener la ejecución si el segundo option list no tiene una opción seleccionada
    }

    if (!isLoggedIn) {
      window.alert("Debes iniciar sesión para agregar a la Wishlist.");
      return;
    }

    try {
      // Verificar si hay una Wishlist existente para el usuario actual
      const wishlistResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/wishlist/${userId}`);
      const wishlistData = await wishlistResponse.json();

      let wishlistId;
      // Si no hay una Wishlist existente, crear una nueva
      if (!wishlistData.wishlistExists) {
        const newWishlistResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const newWishlistData = await newWishlistResponse.json();
        wishlistId = newWishlistData.wishlistId;
      } else {
        wishlistId = wishlistData.wishlistId;
      }

      // Buscar en la tabla CONFIGURACION_PRODUCTO los registros que coincidan con las opciones seleccionadas
      if (tipos.length > 1) {
        const configurationResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/configurationProduct/${selectedOption1}/${selectedOption2}/${props.id}`);
        const configurationData = await configurationResponse.json();
        const itemId = configurationData.itemId;

        // Insertar un nuevo registro en la tabla WISHLIST_ITEM o actualizar si ya existe
        const wishlistItemResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/wishlistItem/${wishlistId}/${itemId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        });
        const wishlistItemData = await wishlistItemResponse.json();
        if (wishlistItemData.success) {
          console.log("Producto agregado a la Wishlist con éxito.");
          window.location.reload();
        } else {
          console.error("Error al agregar producto a la Wishlist.");
        }
      } else {
        const configurationResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/configurationProduct/${selectedOption1}/0/${props.id}`);
        const configurationData = await configurationResponse.json();
        const itemId = configurationData.itemId;

        // Insertar un nuevo registro en la tabla WISHLIST_ITEM o actualizar si ya existe
        const wishlistItemResponse = await fetch(`https://plankton-app-nhztk.ondigitalocean.app/wishlistItem/${wishlistId}/${itemId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        });
        const wishlistItemData = await wishlistItemResponse.json();
        if (wishlistItemData.success) {
          console.log("Producto agregado a la Wishlist con éxito.");
          window.location.reload();
        } else {
          console.error("Error al agregar producto a la Wishlist.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Obtener el precio del producto al seleccionar las opciones
  useEffect(() => {
    if (selectedOption1 && selectedOption2) {
      fetch(`https://plankton-app-nhztk.ondigitalocean.app/configurationProduct/${selectedOption1}/${selectedOption2}/${props.id}`)
        .then(response => response.json())
        .then(data => {
          setPrice(data.price); // Establecer el precio del producto
        })
        .catch(error => console.error('Error fetching price:', error));
    }
  }, [selectedOption1, selectedOption2]);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {smallImages.map((image, index) => (
            <img key={index} src={image} alt="img" onClick={() => handleImageClick(image)} />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={mainImage} alt="img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{props.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
        </div>
        <div className="productdisplay-right-description">
          {props.description}
        </div>
        <div className="productdisplay-right-size">
          <h1>Escoge una variación: </h1>
          <select onChange={handleSelectOption1}>
            <option value="">Select...</option>
            {variationOptions1.map(option => (
              <option key={option.id} value={option.id}>{option.value}</option>
            ))}
          </select>
        </div>
        <div className="productdisplay-right-color">
          <h3>Escoge una segunda variación: </h3>
          <select onChange={handleSelectOption2}>
            <option value="">Select...</option>
            {variationOptions2.map(option => (
              <option key={option.id} value={option.id}>{option.value}</option>
            ))}
          </select>
          <p>{availabilityMessage}</p>
          {price && <p>Precio: Q{price.toFixed(2)}</p>}
        </div>
        <h2>Categoria: {props.categoryName}</h2>
        <button onClick={handleAddToCart} disabled={addToCartDisabled}>AGREGAR AL CARRITO</button>
        <button onClick={handleAddToWishlist} disabled={addToCartDisabled}>LO DESEO</button>    
      </div>
    </div>
  );
};

export default ProductDisplay;
