import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ Importa los iconos de las flechas
import "./VariantCarousel.css";
import PrecioGrid from "../precio/PrecioGrid";

const VariantCarousel = ({ product }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!product || !product.variantes || product.variantes.length <= 1) {
    return null;
  }

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });

    setTimeout(() => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.offsetWidth < container.scrollWidth - 1
      );
    }, 100);
  };

  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.offsetWidth < container.scrollWidth - 1
    );
  };

  return (
    <div className="related-products">
      <h2>
        Más {product.marca} {product.nombre} del mismo fabricante
      </h2>
      <div className="related-carousel-wrapper" onScroll={handleScroll}>
        {canScrollLeft && (
          <button
            className="carousel-arrow left"
            onClick={() => scrollCarousel(-1)}
          >
            {/* ✅ Usa el componente ChevronLeft */}
            <ChevronLeft size={24} color="#111" />
          </button>
        )}

        <div className="related-grid" ref={carouselRef}>
          {product.variantes.map((v) => (
            <Link
              key={v.id}
              to={`/producto/${product.id}/${encodeURIComponent(v.id)}`}
              className="related-card"
            >
              <div className="related-img-wrapper">
                <img
                  src={v.imagenes?.[0]}
                  alt={`${product.nombre} ${v.color?.[0] || "Variante"}`}
                />
              </div>
              <div className="related-info">
                <h3 className="related-name">{product.nombre}</h3>
                <span className="related-color">
                  {v.color?.[0] || "Variante"}
                </span>
                <PrecioGrid producto={product} className="related-price" />
              </div>
            </Link>
          ))}
        </div>

        {canScrollRight && (
          <button
            className="carousel-arrow right"
            onClick={() => scrollCarousel(1)}
          >
            {/* ✅ Usa el componente ChevronRight */}
            <ChevronRight size={24} color="#111" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VariantCarousel;