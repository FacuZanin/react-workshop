import "./Section.css";

import ProductCard from "../common/ProductCard"
import ProductListItem from "./ProductListItem"; 
import { useFavoritos } from "./FavoritosContext";


const Section = ({ title, products, viewType }) => {
  const { favoritos, toggleFavorito } = useFavoritos();

  const renderProductCard = (product) => { // Renombramos 'variante' a 'product' para consistencia
    const cardKey = product.id;
    const isFavorito = favoritos[cardKey];
    const isList = viewType === "list";
    
    // Si es vista de lista, sigue usando ProductListItem (que debe ser refactorizado después)
    if (isList) {
      return (
        <ProductListItem 
          key={cardKey} 
          variante={product} 
          isFavorito={isFavorito} 
          toggleFavorito={toggleFavorito} 
        />
      );
    }

    // Si es vista de cuadrícula (Grid), usa el nuevo ProductCard
    return (
      <ProductCard 
        key={cardKey} 
        product={product} 
        isFavorito={isFavorito}
        toggleFavorito={toggleFavorito}
      />
    );
  };

  return (
    <section className="section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-layout">
        <div
          className={`product-grid ${viewType === "list" ? "list-view" : ""}`}
        >
          {products.map((product) => renderProductCard(product))}
        </div>
      </div>
    </section>
  );
};

export default Section;