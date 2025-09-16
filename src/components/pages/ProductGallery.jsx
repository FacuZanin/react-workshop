import { useState, useEffect } from "react";


const ProductGallery = ({ variant }) => {
  const [mainImage, setMainImage] = useState("");

  // ✅ Actualizamos la imagen principal cuando cambie la variante
  useEffect(() => {
    setMainImage(variant.imagenes?.[0] || "");
  }, [variant]);

  return (
    <div className="gallery-column">
      <div className="thumbnail-list">
        {variant.imagenes?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`thumb-${idx}`}
            className={`thumbnail ${img === mainImage ? "active" : ""}`}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
      <div className="main-image-container-gallery">
        {mainImage && <img src={mainImage} alt="main" className="main-image" />}
      </div>
    </div>
  );
};

export default ProductGallery;
