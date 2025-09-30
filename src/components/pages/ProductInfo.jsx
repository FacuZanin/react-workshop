// ProductInfo.jsx
import { useState } from "react";
// Importamos los iconos necesarios
import { Heart, Send, RulerDimensionLine } from "lucide-react"; 
import "./ProductInfo.css";
import PrecioProducto from "../precio/PrecioProducto";
import { useFavoritos } from "../section/FavoritosContext";
import { useCarrito } from "../pages/CarritoContext";


// 🟢 MODIFICACIÓN CLAVE: Ahora busca archivos .png Y .webp en la carpeta images
const brandLogos = import.meta.glob([
    '/src/assets/images/*.png', 
    '/src/assets/images/*.webp'
], { eager: true });

/**
 * Función para obtener la URL del logo de la marca de forma dinámica.
 * Intenta primero encontrar .webp, luego .png.
 * @param {string} brandName - Nombre de la marca (ej: "Adidas").
 * @returns {string} URL de la imagen del logo o un placeholder.
 */
const getBrandLogoUrl = (brandName) => {
    if (!brandName) return '';

    // 1. Normaliza el nombre de la marca (ej: "Vans" -> "vans")
    const normalizedName = brandName.toLowerCase().replace(/\s/g, ''); 
    
    // 2. Rutas esperadas para ambos formatos
    const expectedPathWebP = `/src/assets/images/${normalizedName}.webp`;
    const expectedPathPNG = `/src/assets/images/${normalizedName}.png`;

    // 3. Busca el logo en el objeto de logos importados, priorizando WEBP
    const logoWebP = brandLogos[expectedPathWebP];
    if (logoWebP?.default) {
        return logoWebP.default;
    }

    const logoPNG = brandLogos[expectedPathPNG];
    if (logoPNG?.default) {
        return logoPNG.default;
    }

    // 4. Retorna placeholder si no se encuentra
    return 'https://via.placeholder.com/55x55.png?text=Logo'; 
};


const ProductInfo = ({ product, variant }) => {
  const [selectedTalle, setSelectedTalle] = useState(null); 

  const { favoritos, toggleFavorito } = useFavoritos();
  const { toggleCarrito, mostrarToast } = useCarrito();
  const cardKey = variant?.id || `${product.id}-default`;

  const isFavorito = favoritos[cardKey];
  const availableTalles = variant?.talles || []; 

  const selectedTalleInfo = availableTalles.find(talleObj => talleObj.talle === selectedTalle);
  
  const handleAddToCart = () => {
    if (!selectedTalle) {
      mostrarToast("Por favor, selecciona un talle antes de agregar al carrito.", "warning");
      return;
    }

    const productToAdd = {
      ...product,
      ...variant,
      talleSeleccionado: selectedTalle,
      distribucionSeleccionada: selectedTalleInfo?.distribucion,
    };
    
    toggleCarrito(productToAdd);
    mostrarToast("Producto agregado al carrito.", "success");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.marca} ${product.nombre}`,
        text: `¡Mira este producto! ${product.nombre}`,
        url: window.location.href,
      })
      .catch(error => console.error('Error al compartir:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      mostrarToast("¡Enlace copiado al portapapeles!", "success");
    }
  };

  const TalleButton = ({
  talleObj,
  distributionMap,
  selectedTalle,
  setSelectedTalle,
}) => {
  const talleRange = talleObj.talle;
  
  // Lógica para el title
  // Usamos 'distributionMap' para buscar la distribución
  const distributionString = distributionMap ? distributionMap[talleRange] : null;
  
  const titleText = distributionString
    ? `Distribución: ${distributionString}`
    : `Rango de talle: ${talleRange} (Distribución no especificada)`;

  return (
    <button
      // Usamos talleRange como key si es único
      key={talleRange} 
      className={`talle-btn ${selectedTalle === talleRange ? "active" : ""}`}
      onClick={() => setSelectedTalle(talleRange)}
      title={titleText} // ✅ Título con la distribución
    >
      {talleRange}
    </button>
  );
};

    // 🟢 Lógica para los tooltips/titles
  const addToCartTitle = selectedTalle 
    ? "Agregar producto al carrito" 
    : "Selecciona un talle primero";
  
  const favoriteTitle = isFavorito 
    ? "Quitar de favoritos" 
    : "Agregar a favoritos";

  const shareTitle = "Compartir producto";

  return (
    <div className="info-column-info">
      
      {/* SECCIÓN DEL LOGO DE LA MARCA */}
      <div className="brand-logo-container"> 
        <img 
          src={getBrandLogoUrl(product.marca)} 
          alt={`Logo de la marca ${product.marca}`} 
          className="brand-logo" 
        />
      </div>

      <h1 className="title">
        {product.marca} {product.nombre}
      </h1>
      
      <p className="sku-id">SKU: {variant?.id || 'N/A'}</p> 

      <div className="product-prices">
        <PrecioProducto producto={product} />
      </div>

       <div className="talles-section">
        <p>Talles Disponibles:</p>
        <div className="talle-buttons">
          {/* ✅ CORRECCIÓN CLAVE: Usamos la variable availableTalles (que es variant?.talles) */}
          {availableTalles.map((talleObj, index) => (
            <TalleButton
              key={index}
              talleObj={talleObj}
              // ✅ CORRECCIÓN CLAVE: Pasamos la distribución desde 'variant'
              distributionMap={variant?.distribucion} 
              selectedTalle={selectedTalle}
              setSelectedTalle={setSelectedTalle}
            />
          ))}
        </div>
      </div>
      
      <div className="size-guide-link" onClick={() => mostrarToast("Guía de talles en proceso...", "info")}>
        <RulerDimensionLine size={18} />
        <span>Ver guía de talle</span>
      </div>

      <div className="cart-fav-section">
        <button 
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={!selectedTalle}
          style={{ opacity: selectedTalle ? 1 : 0.6 }}
          title={addToCartTitle} 
        >
          AGREGAR AL CARRITO
        </button>
        
        <div className="icon-buttons-container"> 
            <button
              className={`favorite-btn-info ${isFavorito ? "active" : ""}`}
              onClick={() => toggleFavorito(cardKey)}
              aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
              title={favoriteTitle}
            >
              <Heart size={20} fill={isFavorito ? "red" : "none"} />
            </button>
            
            <button
              className="share-btn-info"
              onClick={handleShare}
              aria-label="Compartir producto"
               title={shareTitle}
            >
              <Send size={20} stroke="whitesmoke" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;