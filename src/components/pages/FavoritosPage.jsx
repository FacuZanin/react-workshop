import { Link } from "react-router-dom";
import { useFavoritos } from "../section/FavoritosContext";
import { Heart } from "lucide-react";
import "./FavoritosPage.css";
import PrecioProducto from "../precio/PrecioProducto";

const FavoritosPage = ({ products }) => {
  const { favoritos, toggleFavorito } = useFavoritos();

  // 🔹 Generar lista de favoritos desde products
  const favoritosList = (products || []).flatMap((producto) =>
    (producto.variantes || [])
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
      <div className="favoritos-layout-wrapper">
        <h2>Mis Favoritos</h2>
        <div className="favoritos-grid">
          {favoritosList.map(({ producto, variante, cardKey }) => {
            const imagenUrl = variante.imagenes?.[0] || "";
            const color = variante.color?.[0] || "default";

            return (
              <div key={cardKey} className="favorito-card">
                <Link to={`/producto/${producto.id}/${variante.id}`}>
                  <img src={imagenUrl} alt="..." className="favorito-img" />
                  <div className="favorito-info">
                    <h3>
                      {producto.marca} {producto.nombre}
                    </h3>
                    <p>{color} · {producto.fabrica}</p>
                    <PrecioProducto
                      producto={producto}
                      className="product-price-favorito"
                    />
                  </div>
                </Link>

                <div className="card-actions">
                  {/* ❤️ Botón Favorito */}
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
