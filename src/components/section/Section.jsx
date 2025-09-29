// src/components/section/Section.jsx

import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Section.css";
import PrecioGrid from "../precio/PrecioGrid";
import { useFavoritos } from "./FavoritosContext";
import ProductImage from "./ProductImage"; // 👈 Importamos el nuevo componente

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
            // ✅ Acepta URL vacías o nulas
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
                  to={`/producto/${variante.productoId}/${variante.id}`}
                  className="product-link"
                >
                  {/* 🚨 Reemplazamos el contenedor de imagen con ProductImage */}
                  <ProductImage
                    src={imagenUrl}
                    alt={`${variante.productoMarca} ${variante.productoNombre}`}
                    className="product-image"
                  />
                  {/* -------------------------------------------------------- */}
                  
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