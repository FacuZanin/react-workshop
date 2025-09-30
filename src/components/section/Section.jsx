// src/components/section/Section.jsx - MODIFICADO

import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Section.css";
import PrecioGrid from "../precio/PrecioGrid";
import { useFavoritos } from "./FavoritosContext";
import ProductImage from "./ProductImage"; 
// 💡 Importamos el nuevo componente
import ProductListItem from "./ProductListItem"; 

const Section = ({ title, products, viewType }) => {
  const { favoritos, toggleFavorito } = useFavoritos();

  const renderProductCard = (variante) => {
    const imagenUrl = variante.imagenes?.[0] || ""; 
    const cardKey = variante.id;
    const isFavorito = favoritos[cardKey];
    const isList = viewType === "list";
    
    // 💡 Lógica para usar el nuevo componente en vista de lista
    if (isList) {
      return (
        <ProductListItem 
          key={cardKey} 
          variante={variante} 
          isFavorito={isFavorito} 
          toggleFavorito={toggleFavorito} 
        />
      );
    }

    // Contenido de la tarjeta en vista de cuadrícula (Grid) - Lógica original
    return (
      <div 
        key={cardKey} 
        // Restauramos la clase original
        className={`product-card ${viewType === "list" ? "list-card" : ""}`}
      >
        <button
          className={`favorite-btn-card ${isFavorito ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorito(cardKey);
          }}
          title="Añadir a Favoritos"
        >
          <Heart
            size={20}
            strokeWidth={2}
            fill={isFavorito ? "red" : "none"}
          />
        </button>
        <Link
          // ✅ Ruta original restaurada
          to={`/producto/${variante.productoId}/${variante.id}`}
          className="product-link"
        >
          <ProductImage
            src={imagenUrl}
            // ✅ Nombres de variables originales
            alt={`${variante.productoMarca} ${variante.productoNombre}`}
            className="product-image"
          />
          <div className="product-info">
            <h3 className="product-title">
              {/* ✅ Nombres de variables originales */}
              {variante.productoMarca} {variante.productoNombre}
            </h3>
            <p className="product-type">
              {/* ✅ Nombres de variables originales */}
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
  };

  return (
    <section className="section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-layout">
        <div
          // Aplicamos 'list-view' al contenedor solo si la vista es lista
          className={`product-grid ${viewType === "list" ? "list-view" : ""}`}
        >
          {products.map((variante) => renderProductCard(variante))}
        </div>
      </div>
    </section>
  );
};

export default Section;