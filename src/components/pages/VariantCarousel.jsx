import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./VariantCarousel.css";
import PrecioGrid from "../precio/PrecioGrid";

const VariantCarousel = ({ product }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  if (product.variantes.length <= 1) return null;

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="related-grid" ref={carouselRef}>
          {product.variantes.map((v) => (
            <Link
              key={v.id}
              to={`/producto/${product.id}/${encodeURIComponent(v.id)}`} // ✅ usa variantId
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default VariantCarousel;
