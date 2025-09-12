import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import "./Section.css";
import PrecioGrid from "../precio/PrecioGrid";
import { useFavoritos } from "./FavoritosContext";
import { useCarrito } from "../pages/CarritoContext";

const Section = ({ title, products }) => {
  const { favoritos, toggleFavorito } = useFavoritos();
  const { carrito, toggleCarrito } = useCarrito();

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
              const productoCarrito = {
                id: cardKey,
                nombre: producto.nombre,
                variante: variante.id,
                imagen: imagenUrl,
                precio: variante.precio,
                talles: variante.talles,
                color: variante.color,
                cantidad: 1,
              };

              return (
                <div key={cardKey} className="product-card">
                  {/* ✅ Botón de favoritos en la esquina superior derecha */}
                  <button
                    className={`favorite-btn-card ${
                      isFavorito ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Previene que el clic active el link
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

                  {/* ✅ Contenedor del carrito que aparece al hover */}
                  <div className="cart-action-container">
                    <button
                      className={`cart-btn-desktop ${
                        enCarrito ? "active" : ""
                      }`}
                      onClick={() => toggleCarrito(productoCarrito)}
                    >
                      <ShoppingCart
                        size={20}
                        strokeWidth={2}
                        fill={enCarrito ? "green" : "none"}
                        color={enCarrito ? "green" : "black"}
                      />
                      <span>{enCarrito ? " En el carrito" : " Agregar al carrito"}</span>
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