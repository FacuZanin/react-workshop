// ProductInfo.jsx
import { useState } from "react";
import { Heart } from "lucide-react";
import "./ProductInfo.css";
import PrecioProducto from "../precio/PrecioProducto";
import { useFavoritos } from "../section/FavoritosContext";
import { useCarrito } from "../pages/CarritoContext";

const ProductInfo = ({ product, variant }) => {
  const [selectedTalle, setSelectedTalle] = useState(null); // ✅ Mejor validación

  const { favoritos, toggleFavorito } = useFavoritos();
  const { toggleCarrito } = useCarrito();
  const cardKey = variant?.id || `${product.id}-default`;

  const isFavorito = favoritos[cardKey];
  const availableTalles = variant?.talles || [];

  const selectedTalleInfo = availableTalles.find(talleObj => talleObj.talle === selectedTalle);
  
  const handleAddToCart = () => {
    if (!selectedTalle) {
      return;
    }

    const productToAdd = {
      ...product,
      ...variant,
      talleSeleccionado: selectedTalle,
      distribucionSeleccionada: selectedTalleInfo?.distribucion,
    };
    
    toggleCarrito(productToAdd);
  };

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
          {availableTalles.map((talleObj, idx) => (
            <button
              key={idx}
              className={`talle-btn ${selectedTalle === talleObj.talle ? "active" : ""}`}
              onClick={() => setSelectedTalle(talleObj.talle)}
            >
              {talleObj.talle}
            </button>
          ))}
        </div>
      </div>

      <div className="cart-fav-section">
        <button 
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={!selectedTalle}
          style={{ opacity: selectedTalle ? 1 : 0.6 }}
        >
          AGREGAR AL CARRITO
        </button>
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