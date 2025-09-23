import { Link } from "react-router-dom";
import { useFavoritos } from "../section/FavoritosContext";
import { useCarrito } from "../pages/CarritoContext";
import { Heart, ShoppingCart } from "lucide-react";
import "./FavoritosPage.css";

const FavoritosPage = ({ products }) => {
  const { favoritos, toggleFavorito } = useFavoritos();
  const { carrito, toggleCarrito } = useCarrito();

  // 🔹 Generar lista de favoritos desde products
  const favoritosList = products.flatMap((producto) =>
    producto.variantes
      .map((variante) => {
        const cardKey =
          variante.id || `${producto.id}-${variante.color?.[0] || "default"}`;
        if (favoritos[cardKey]) {
          return { producto, variante, cardKey };
        }
        return null;
      })
      .filter(Boolean)
  );

  if (favoritosList.length === 0) {
    return <p className="no-favs">No tenés favoritos todavía ❤️</p>;
  }

  return (
    <section className="favoritos-page">
      {/* ✅ NUEVO CONTENEDOR */}
      <div className="favoritos-layout-wrapper">
        <h2>Mis Favoritos</h2>
        <div className="favoritos-grid">
          {favoritosList.map(({ producto, variante, cardKey }) => {
            const imagenUrl = variante.imagenes?.[0] || "";
            const color = variante.color?.[0] || "default";

            // 🔹 Objeto del carrito para este producto
            // ✅ Modificación para usar un objeto más completo para el carrito
            const productoCompleto = {
              ...producto,
              ...variante,
              id: variante.id,
              key: variante.id,
              imagen: imagenUrl,
              precioCaja: producto.precioCaja ?? 0,
              precioSinCaja: producto.precioSinCaja ?? 0,
            };

            // 🔹 Verificar si ya está en el carrito
            const enCarrito = carrito.some((item) => item.id === variante.id); // ✅ Cambio a item.id

            return (
              <div key={cardKey} className="favorito-card">
                <Link
                  to={`/producto/${producto.id}/${variante.id}`} // ✅ Cambio a usar variante.id
                >
                  <img src={imagenUrl} alt="..." className="favorito-img" />
                  <div className="favorito-info">
                    <h3>
                      {producto.marca} {producto.nombre}
                    </h3>
                    <p>{color}</p>
                  </div>
                </Link>

                <div className="card-actions"> {/* ✅ Nuevo contenedor para los botones */}
                  {/* ❤️ Botón Favorito (izquierda) */}
                  <button
                    className={`favorite-btn-card ${
                      favoritos[cardKey] ? "active" : ""
                    }`}
                    onClick={() => toggleFavorito(cardKey)}
                    aria-label={
                      favoritos[cardKey]
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                  >
                    <Heart
                      size={20}
                      strokeWidth={2}
                      fill={favoritos[cardKey] ? "red" : "none"}
                    />
                  </button>
                  {/* ✅ Botón de Carrito (derecha) */}
                  <button
                    className={`cart-btn-card ${enCarrito ? "active" : ""}`}
                    onClick={() => toggleCarrito(productoCompleto)}
                    aria-label={
                      enCarrito ? "Quitar del carrito" : "Agregar al carrito"
                    }
                  >
                    <ShoppingCart
                      size={20}
                      strokeWidth={2}
                      fill={enCarrito ? "green" : "none"}
                      color={enCarrito ? "green" : "black"}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FavoritosPage;