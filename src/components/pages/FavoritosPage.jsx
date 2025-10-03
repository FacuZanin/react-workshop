import { Link } from "react-router-dom";
import { useFavoritos } from "../section/FavoritosContext";
import "./FavoritosPage.css";
import ProductCard from '../common/ProductCard'; 


const FavoritosPage = ({ products }) => {
  const { favoritos, toggleFavorito } = useFavoritos();

  // 🔹 Generar lista de favoritos desde products
  const favoritosList = (products || []).flatMap((producto) =>
    (producto.variantes || [])
      .map((variante) => {
        const cardKey =
          variante.id || `${producto.id}-${variante.color?.[0] || "default"}`;
        
        if (favoritos[cardKey]) {
          // Si el precio en la variante no está definido o es 0, usamos el del padre
          const precioCajaFinal = Number(variante.precioCaja) || Number(producto.precioCaja) || 0;
          const precioSinCajaFinal = Number(variante.precioSinCaja) || Number(producto.precioSinCaja) || 0;
          
          return { 
            ...variante, // Data original de la variante
            productoId: producto.id,
            cardKey: cardKey,
            
            // ✅ CORRECCIÓN CLAVE: Sobreescribimos con los precios finales
            precioCaja: precioCajaFinal, 
            precioSinCaja: precioSinCajaFinal, 
            
            // Propiedades descriptivas
            productoMarca: producto.marca,   
            productoNombre: producto.nombre, 
            productoTipo: producto.fabrica,  
          }; 
        }
        return null;
      })
      .filter(Boolean)
  );

  if (favoritosList.length === 0) {
    return <p className="no-favs">No tenés favoritos todavía ❤️</p>;
  }

  return (
    <section className="favoritos-page">
      <div className="favoritos-layout-wrapper">
        <h2>Mis Favoritos</h2>
        <div className="favoritos-grid">
          {favoritosList.map((product) => {
            const isFavorito = favoritos[product.cardKey];
            
            return (
              <ProductCard
                key={product.cardKey} 
                product={product} 
                isFavorito={isFavorito}
                toggleFavorito={toggleFavorito}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FavoritosPage;