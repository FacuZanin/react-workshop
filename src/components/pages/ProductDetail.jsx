import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import VariantCarousel from "./VariantCarousel";
import "./ProductDetail.css"; 
import "./ProductInfo.css";
import "./VariantCarousel.css";
import { useFavoritos } from "../section/FavoritosContext";
import { ChevronDown } from "lucide-react";

const ProductDetail = () => {
  const { id, variantId } = useParams();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [openSection, setOpenSection] = useState("");

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => String(p.id) === String(id));
        if (found) {
          setProduct(found);
          const selectedVariant = found.variantes.find(
            (v) => String(v.id) === String(variantId)
          );
          setVariant(selectedVariant || found.variantes[0]);
        }
      })
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id, variantId]);

  if (!product) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <p>Cargando producto...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="product-detail-page-wrapper">
        <div className="product-detail-page">
          <div className="gallery-column">
            <ProductGallery variant={variant} />
          </div>

          <div className="info-column">
            <ProductInfo product={product} variant={variant} />
          </div>
        </div>

        <div className="accordion-container">
          <div
            className={`accordion-item ${openSection === "desc" ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() =>
                setOpenSection(openSection === "desc" ? "" : "desc")
              }
            >
              DESCRIPCIÓN
              <span
                className={`arrow ${openSection === "desc" ? "rotate" : ""}`}
              >
                <ChevronDown size={24} />
              </span>
            </div>
            <div className="accordion-body">
              {product.descripcion}
            </div>
          </div>

          <div
            className={`accordion-item ${openSection === "specs" ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() =>
                setOpenSection(openSection === "specs" ? "" : "specs")
              }
            >
              ESPECIFICACIONES
              <span
                className={`arrow ${openSection === "specs" ? "rotate" : ""}`}
              >
                <ChevronDown size={24} />
              </span>
            </div>
            <div className="accordion-body">
              Tipo: {product.tipo} <br />
              Color: {variant?.color?.join(", ")} <br />
              Suela: {product.suela} <br />
              Origen: {product.origen} <br />
              Fabrica: {product.fabrica} <br />
              {product.colaboracion && <>Colaboración: Sí <br /></>}
              <br />
              <strong>Distribución:</strong>
              <div className="distribucion-list">
                {variant?.distribucion &&
                  Object.keys(variant.distribucion).map((talle) => (
                    <div key={talle} className="distribucion-item">
                      <strong>{talle}:</strong> {variant.distribucion[talle]}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <VariantCarousel product={product} />
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;