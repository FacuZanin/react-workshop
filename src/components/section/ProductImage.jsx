import React, { useState } from 'react';
import { ImageOff } from 'lucide-react'; 


const PLACEHOLDER_TEXT = 'Error al cargar imagen';

const ProductImage = ({ src, alt, className }) => {

  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const handleImageError = () => {
    if (hasError) return; 

    setHasError(true);
  };
  
  if (hasError) {
    return (
      <div className="product-image-container no-image">
        <ImageOff size={32} />
        <p>{PLACEHOLDER_TEXT}</p>
      </div>
    );
  }

  return (
    <div className="product-image-container">
      <img
        src={currentSrc} 
        alt={alt}
        className={className}
        onError={handleImageError}
      />
    </div>
  );
};

export default ProductImage;