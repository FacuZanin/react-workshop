// src/components/section/ProductImage.jsx
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react'; // Icono de Lucide para "sin imagen"

// 💡 Si tu imagen de reemplazo es un archivo (ej: /public/placeholder.jpg),
// puedes usar esa ruta aquí. Para este ejemplo, usaremos el ícono y el CSS.

const PLACEHOLDER_TEXT = 'Sin Imagen';
// Ruta de tu imagen de reemplazo, si existe. Si no, usamos el ícono.
// const PLACEHOLDER_IMAGE_URL = '/placeholder.jpg'; 

const ProductImage = ({ src, alt, className }) => {
  // Estado para rastrear si la URL actual falló al cargar
  const [hasError, setHasError] = useState(false);

  // Estado para rastrear la URL que estamos intentando cargar (puede ser src o placeholder)
  const [currentSrc, setCurrentSrc] = useState(src);
  
  // 💡 Lógica para manejar el error de carga de la imagen
  const handleImageError = () => {
    // Si ya ha habido un error, no hacemos nada para evitar loops.
    if (hasError) return; 

    setHasError(true);
    // ⚠️ Si quieres usar una imagen específica de reemplazo, descomenta la línea de abajo:
    // setCurrentSrc(PLACEHOLDER_IMAGE_URL);
  };
  
  // Si la imagen original falló, renderizamos el div con el estilo de placeholder.
  if (hasError) {
    return (
      <div className="product-image-container no-image">
        <ImageOff size={32} />
        <p>{PLACEHOLDER_TEXT}</p>
      </div>
    );
  }

  // Si no hay error, renderizamos la imagen normal
  return (
    <div className="product-image-container">
      <img
        // Usamos la URL original (src) ya que el `onError` la disparará si falla
        src={currentSrc} 
        alt={alt}
        className={className}
        onError={handleImageError} // 🚨 Evento que se dispara en caso de 404
      />
    </div>
  );
};

export default ProductImage;