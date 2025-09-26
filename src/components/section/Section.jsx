import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Section.css";
import PrecioGrid from "../precio/PrecioGrid";
import { useFavoritos } from "./FavoritosContext";

const Section = ({ title, products, viewType }) => {
  const { favoritos, toggleFavorito } = useFavoritos();

  return (
    <section className="section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-layout">
        <div
          className={`product-grid ${viewType === "list" ? "list-view" : ""}`}
        >
          {products.map((variante) => {
            const imagenUrl = variante.imagenes?.[0] || "";
            const color = variante.color?.[0] || "default";
            const cardKey = variante.id;
            const isFavorito = favoritos[cardKey];

            return (
              <div
                key={cardKey}
                className={`product-card ${
                  viewType === "list" ? "list-card" : ""
                }`}
              >
                <button
                  className={`favorite-btn-card ${isFavorito ? "active" : ""}`}
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
                  // Construimos el enlace con los IDs del producto y la variante
                  to={`/producto/${variante.productoId}/${variante.id}`}
                  className="product-link"
                >
                  <div className="product-image-container">
                    <img
                      src={imagenUrl}
                      alt={`${variante.productoNombre} ${color}`}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      {variante.productoMarca} {variante.productoNombre}
                    </h3>
                    <p className="product-type">
                      {variante.productoTipo || "Sin tipo"}
                    </p>
                    <PrecioGrid
                      producto={variante}
                      className="product-price"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Section;