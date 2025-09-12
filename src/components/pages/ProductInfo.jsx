import { useState } from "react";
import { Heart } from "lucide-react";
import "./ProductInfo.css";
import PrecioProducto from "../precio/PrecioProducto";
import { useFavoritos } from "../section/FavoritosContext";

const ProductInfo = ({ product, variant }) => {
  const [selectedTalle, setSelectedTalle] = useState("");

  const { favoritos, toggleFavorito } = useFavoritos();
  const cardKey = variant?.id || `${product.id}-default`;

  const isFavorito = favoritos[cardKey];

  const availableTalles = variant?.talles || [];

  return (
    <div className="info-column-info">
      <h2 className="brand">{product.marca}</h2>
      <h1 className="title">
        {product.marca} {product.nombre}
      </h1>

      <div className="product-prices">
        <PrecioProducto producto={product} />
      </div>

      <div className="talles-section">
        <h5>Distribución de talles</h5>
        <div className="talle-buttons">
          {availableTalles.map((t, idx) => (
            <button
              key={idx}
              className={`talle-btn ${selectedTalle === t ? "active" : ""}`}
              onClick={() => setSelectedTalle(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="cart-fav-section">
        <button className="add-to-cart">AGREGAR AL CARRITO</button>
        <button
          className={`favorite-btn-info ${isFavorito ? "active" : ""}`}
          onClick={() => toggleFavorito(cardKey)}
          aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            size={20}
            strokeWidth={2}
            fill={isFavorito ? "red" : "none"}
          />
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;