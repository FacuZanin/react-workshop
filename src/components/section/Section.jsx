import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import "./Section.css";
import PrecioGrid from "../precio/PrecioGrid";
import { useFavoritos } from "./FavoritosContext";
import { useCarrito } from "../pages/CarritoContext";
import { useState, useEffect } from "react"; // ✅ Importa useEffect

const Section = ({ title, products }) => {
  const { favoritos, toggleFavorito } = useFavoritos();
  const { carrito, toggleCarrito } = useCarrito();
  const [talleSeleccionado, setTalleSeleccionado] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // ✅ Estado para el ancho de la ventana

  // ✅ Lógica para actualizar el ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTalleClick = (cardId, talle) => {
    setTalleSeleccionado((prev) => ({
      ...prev,
      [cardId]: talle,
    }));
  };

  const handleAddToCart = (productoCompleto, cardKey) => {
    const isAlreadyInCart = carrito.some((item) => item.id === cardKey);
    
    if (!talleSeleccionado[cardKey] && !isAlreadyInCart) {
      alert("Por favor, selecciona un talle antes de agregar al carrito.");
      return;
    }

    const productoConTalle = {
      ...productoCompleto,
      talleSeleccionado: talleSeleccionado[cardKey],
      distribucionSeleccionada: productoCompleto.distribucion[talleSeleccionado[cardKey]]
    };

    toggleCarrito(productoConTalle);

    setTimeout(() => {
      const updatedCart = JSON.parse(localStorage.getItem('carrito')) || [];
      const isStillInCart = updatedCart.some(item => item.id === cardKey);
      
      if (!isStillInCart) {
        setTalleSeleccionado(prev => {
          const newTalles = { ...prev };
          delete newTalles[cardKey];
          return newTalles;
        });
      }
    }, 0);
  };
  
  // ✅ Lógica para definir el texto del botón
  const buttonText = windowWidth <= 480 ? "Agregar" : "Agregar al carrito";

  return (
    <section className="section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-layout">
        <div className="product-grid">
          {products.flatMap((producto) =>
            producto.variantes.map((variante) => {
              const imagenUrl = variante.imagenes?.[0] || "";
              const color = variante.color?.[0] || "default";
              const cardKey = variante.id;
              const isFavorito = favoritos[cardKey];
              const enCarrito = carrito.some((item) => item.id === cardKey);
              const talleElegido = talleSeleccionado[cardKey];

              const productoCompleto = {
                ...producto,
                ...variante,
                id: variante.id,
                key: variante.id,
                imagen: imagenUrl,
                precioCaja: producto.precioCaja ?? 0,
                precioSinCaja: producto.precioSinCaja ?? 0,
              };

              const buttonClasses = `cart-btn-desktop ${
                enCarrito ? "active" : talleElegido ? "enabled" : "disabled"
              }`;
              const buttonDisabled = !talleElegido && !enCarrito;
              
              return (
                <div key={cardKey} className="product-card">
                  <button
                    className={`favorite-btn-card ${
                      isFavorito ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorito(cardKey);
                    }}
                  >
                    <Heart
                      size={20}
                      strokeWidth={2}
                      fill={isFavorito ? "red" : "none"}
                    />
                  </button>
                  <Link
                    to={`/producto/${producto.id}/${variante.id}`}
                    className="product-link"
                  >
                    <div className="product-image-container">
                      <img
                        src={imagenUrl}
                        alt={`${producto.nombre} ${color}`}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">
                        {producto.marca} {producto.nombre} {color}
                      </h3>
                      <p className="product-type">
                        {producto.tipo || "Sin tipo"}
                      </p>
                      <PrecioGrid
                        producto={producto}
                        className="product-price"
                      />
                    </div>
                  </Link>

                  <div className="product-sizes-container">
                    {variante.talles.map((talle) => (
                      <button
                        key={talle}
                        className={`size-btn ${
                          talleElegido === talle ? "active" : ""
                        }`}
                        onClick={() => handleTalleClick(cardKey, talle)}
                        disabled={enCarrito}
                      >
                        {talle}
                      </button>
                    ))}
                  </div>

                  <div className="cart-action-container">
                    <button
                      className={buttonClasses}
                      onClick={() => handleAddToCart(productoCompleto, cardKey)}
                      disabled={buttonDisabled}
                    >
                      <ShoppingCart
                        size={20}
                        strokeWidth={2}
                        fill={enCarrito ? "green" : (talleElegido ? "green" : "none")}
                        color={enCarrito ? "green" : (talleElegido ? "green" : "black")}
                      />
                      <span>
                        {enCarrito ? "En el carrito" : buttonText} {/* ✅ Uso de la variable */}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Section;