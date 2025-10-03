  import React, { useState } from "react";
  import { Link } from "react-router-dom";
  import { Heart, Send } from "lucide-react";
  import PrecioGrid from "../precio/PrecioGrid";
  import ProductImage from "./ProductImage";
  // Asumo que el contexto de Carrito y su función mostrarToast están disponibles
  import { useCarrito } from "../pages/CarritoContext";
  import "./ProductListItem.css";

  // 🟢 NUEVO: Importación dinámica de logos desde src/assets/images
  // Esto carga todos los archivos .png y .webp de esa carpeta.
  const brandLogos = import.meta.glob([
      '/src/assets/images/*.png', 
      '/src/assets/images/*.webp'
  ], { eager: true });

  // 🟢 NUEVA FUNCIÓN: Obtiene la URL del logo
  const getBrandLogoUrl = (brandName) => {
      if (!brandName) return '';

      // Normaliza el nombre de la marca (ej: "Adidas" -> "adidas")
      const normalizedName = brandName.toLowerCase().replace(/\s/g, ''); 
      
      // Rutas esperadas para ambos formatos
      const expectedPathWebP = `/src/assets/images/${normalizedName}.webp`;
      const expectedPathPNG = `/src/assets/images/${normalizedName}.png`;

      // Busca el logo en el objeto de logos importados, priorizando WEBP
      const logoWebP = brandLogos[expectedPathWebP];
      if (logoWebP && logoWebP.default) return logoWebP.default;

      // Si no encuentra .webp, busca .png
      const logoPNG = brandLogos[expectedPathPNG];
      if (logoPNG && logoPNG.default) return logoPNG.default;

      return null; // Retorna null si no se encuentra el logo
  };

  const ProductListItem = ({ variante, isFavorito, toggleFavorito }) => {
    const [selectedTalle, setSelectedTalle] = useState(null);
    const { toggleCarrito, mostrarToast } = useCarrito();

    const imagenUrl = variante.imagenes?.[0] || "";
    const cardKey = variante.id;
    const logoUrl = getBrandLogoUrl(variante.productoMarca); 
    const availableTalles = variante.talles || [];
    const allDistribuciones = variante.distribucion || {};

    // Lógica para obtener la distribución del talle seleccionado
    const selectedTalleDistribucion = selectedTalle
      ? allDistribuciones[selectedTalle] ||
        `Distribución no detallada para talle ${selectedTalle}`
      : "Selecciona un talle primero.";

    // --- Lógica de Botones (queda igual) ---
    const handleShare = (e) => {
      e.preventDefault();
      const productUrl = `${window.location.origin}/producto/${variante.productoId}/${variante.id}`;
      navigator.clipboard.writeText(productUrl);
      mostrarToast("¡Enlace copiado al portapapeles!", "success");
    };

    const handleAddToCart = (e) => {
      e.preventDefault();
      if (!selectedTalle) {
        mostrarToast(
          "Por favor, selecciona un talle antes de agregar al carrito.",
          "warning"
        );
        return;
      }

      const productToAdd = {
        ...variante,
        talleSeleccionado: selectedTalle,
        distribucionSeleccionada: selectedTalleDistribucion,
      };

      toggleCarrito(productToAdd);
      mostrarToast("Producto agregado al carrito.", "success");
    };

    // --- JSX de Botones y Specs ---

    const favoriteTitle = isFavorito
      ? "Quitar de favoritos"
      : "Agregar a favoritos";

    const favoriteButton = (
      <button
        // ✅ Clase Renombrada
        className={`list-favorite-btn ${isFavorito ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorito(cardKey);
        }}
        title={favoriteTitle}
      >
        <Heart size={20} strokeWidth={2} fill={isFavorito ? "red" : "none"} />
      </button>
    );

    const shareButton = (
      <button
        // ✅ Clase Renombrada
        className="list-share-btn"
        onClick={handleShare}
        title="Compartir producto"
      >
        <Send size={20} fill="none" />
      </button>
    );

    const specs = [
      { key: "Origen", value: variante.origen },
      { key: "Fábrica", value: variante.fabrica },
      { key: "Suela", value: variante.suela },
    ].filter((s) => s.value);

    const addToCartTitle = selectedTalle
      ? "Agregar producto al carrito"
      : "Selecciona un talle primero";

    return (
      // Estructura de 5 COLUMNAS
      <div key={cardKey} className="product-card list-card-layout">
        {/* COLUMNA 1: IMAGEN */}
        <div className="list-card-image-col">
          <Link
            to={`/producto/${variante.productoId}/${variante.id}`}
            className="product-link"
          >
            <ProductImage
              src={imagenUrl}
              alt={`${variante.productoMarca} ${variante.productoNombre}`}
              className="product-image"
            />
          </Link>
        </div>

        {/* COLUMNA 2: TÍTULO, TIPO/COLOR, PRECIO GRANDE */}
        <div className="list-card-col-2-details">
          <div className="list-card-header">
          <Link
            to={`/producto/${variante.productoId}/${variante.id}`}
            className="product-link"
          >
            <h3 className="product-title">
              {/* 🟢 CAMBIO CLAVE: Contenedor separado para Logo y Marca (con Flexbox) */}
              <div className="product-marca-row">
                {/* El logo va primero */}
                {logoUrl && (
                    <img 
                        src={logoUrl} 
                        alt={`${variante.productoMarca} logo`} 
                        className="product-marca-logo" 
                    />
                )}
                {/* El texto de la marca va segundo */}
                <span className="product-marca-text">
                  {variante.productoMarca}
                </span>
              </div>
              {/* El nombre del producto irá DEBAJO de la marca (comportamiento normal de un <div>) */}
              <span className="product-nombre">{variante.productoNombre}</span>
            </h3>
          </Link>
            <p className="product-type">
              Tipo: {variante.productoTipo || "Sin tipo"} | Color:{" "}
              {variante.color?.[0] || "Múltiple"}
            </p>
          </div>

          {/* PRECIO GRANDE */}
          <div className="list-product-price-large">
            <h5>
              <PrecioGrid producto={variante} className="list-product-price" />
            </h5>
          </div>
        </div>

        {/* COLUMNA 3: SPECS, DISTRIBUCIÓN Y DESCRIPCIÓN SNIPPET */}
        <div className="list-card-col-3-specs">
          {/* INFORMACIÓN DETALLADA (Origen, Fábrica, Suela) */}
          <div className="list-card-specs-info">
            {specs.map((spec) => (
              <p key={spec.key} className="spec-item">
                <strong>{spec.key}:</strong> {spec.value}
              </p>
            ))}
            <div className="list-card-distribution-info">
              <strong>Distribución:</strong>
              <p>{selectedTalleDistribucion}</p>
            </div>
          </div>
        </div>

        {/* COLUMNA 4: TALLES Y AGREGAR AL CARRITO */}
        <div className="list-card-talles-col">
          {/* Botones de Talles (Arriba) */}
          <div className="talles-section-list">
            <h6 className="talles-title-list">Talles disponibles</h6>
            {/* ✅ Contenedor Renombrado */}
            <div className="list-talle-buttons">
              {availableTalles.map((talle) => (
                <button
                  key={talle}
                  // ✅ Clase Renombrada
                  className={`list-talle-btn ${
                    selectedTalle === talle ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTalle(talle);
                  }}
                >
                  {talle}
                </button>
              ))}
              {availableTalles.length === 0 && (
                <p className="no-talles-available">Sin talles detallados</p>
              )}
            </div>
          </div>

          {/* Botón Agregar al Carrito (Debajo) */}
          <button
            // ✅ Clase Renombrada
            className="btn-primario list-add-to-cart"
            onClick={handleAddToCart}
            disabled={!selectedTalle}
            style={{ opacity: selectedTalle ? 1 : 0.6 }}
            title={addToCartTitle}
          >
            AGREGAR AL CARRITO
          </button>
        </div>

        {/* COLUMNA 5: ACCIONES (FAVORITO Y COMPARTIR) */}
        <div className="list-card-actions-col">
          <div className="icon-buttons-container-list">
            {favoriteButton}
            {shareButton}
          </div>
        </div>
      </div>
    );
  };

  export default ProductListItem;
