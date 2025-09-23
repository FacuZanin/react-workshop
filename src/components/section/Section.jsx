// Section.jsx
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Section.css";
import PrecioGrid from "../precio/PrecioGrid";
import { useFavoritos } from "./FavoritosContext";
import { useState } from "react";

const Section = ({ title, products }) => {
  const { favoritos, toggleFavorito } = useFavoritos();

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

              return (
                <div key={cardKey} className="product-card">
                  {/* ✅ Botón de Favorito */}
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
                  {/* ✅ Link a la página del producto */}
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
                        {producto.marca} {producto.nombre}
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