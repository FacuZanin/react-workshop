// src/common/ProductCard/ProductCard.jsx

import React from 'react'; 
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import styles from './ProductCard.module.css'; 
import PrecioGrid from '../../components/precio/PrecioGrid'; 


const ProductCard = ({ product, isFavorito, toggleFavorito }) => {
  if (!product) return null;

  const { id, productoId, productoMarca, productoNombre, productoTipo, imagenes } = product;
  const cardKey = id;
  const imagenUrl = imagenes?.[0] || ""; 
  
  return (
    <div className={styles.card}>
      
      {/* 2. Botón de Favorito */}
      <button
        className={`${styles.favoriteBtnCard} ${isFavorito ? styles.active : ""}`}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorito(cardKey);
        }}
        title="Añadir a Favoritos"
      >
        <Heart
          size={18}
          strokeWidth={2}
          fill={isFavorito ? "red" : "none"}
        />
      </button>

      {/* 3. Link de Producto */}
      <Link
        to={`/producto/${productoId}/${id}`}
        className={styles.productLink}
      >
        {/* 4. Contenedor de Imagen */}
        <div className={styles.productImageContainer}>
          {imagenUrl ? (
            <img 
              src={imagenUrl} 
              alt={`${productoMarca} ${productoNombre}`} 
              className={styles.productImage}
            />
          ) : (
            <div className={styles.noImage}>Sin Imagen</div>
          )}
        </div>

        {/* 5. Información del Producto */}
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>
            {productoMarca} {productoNombre}
          </h3>
          <p className={styles.productType}>
            {productoTipo || "Sin tipo"}
          </p>
                   
          <PrecioGrid 
            producto={product} 
            className={styles.productPrice} 
          />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;