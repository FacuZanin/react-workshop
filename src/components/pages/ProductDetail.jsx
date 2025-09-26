// ProductDetail.jsx
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
import { useCarrito } from "./CarritoContext";
import ToastNotification from "../common/ToastNotification";

const ProductDetail = () => {
  const { id, variantId } = useParams();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  // 💡 Mantenemos el estado de la sección abierta (puede ser "specs" o "description")
  const [openSection, setOpenSection] = useState("");
  const { toast, hideToast } = useCarrito();

  // Función genérica para alternar el estado del acordeón
  const toggleAccordion = (sectionName) => {
    setOpenSection(openSection === sectionName ? "" : sectionName);
  };

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => {
        // 🔹 primero buscamos el producto que contenga el variantId
        const foundProduct = data.find((p) =>
          p.variantes?.some((v) => String(v.id) === String(variantId))
        );

        if (foundProduct) {
          setProduct(foundProduct);

          const foundVariant = foundProduct.variantes.find(
            (v) => String(v.id) === String(variantId)
          );

          let selectedVariant = foundVariant || foundProduct.variantes[0];

          if (selectedVariant?.distribucion) {
            const tallesArray = Object.keys(selectedVariant.distribucion).map(
              (talle) => ({
                talle,
                distribucion: selectedVariant.distribucion[talle],
              })
            );
            setVariant({ ...selectedVariant, talles: tallesArray });
          } else {
            setVariant(selectedVariant || {});
          }
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
            <ProductGallery product={product} variant={variant} />
          </div>
          <div className="info-column">
            <ProductInfo product={product} variant={variant} />
          </div>
        </div>
        <div className="accordion-container">
          
          {/* 🟢 NUEVO: ACORDEÓN DE DESCRIPCIÓN */}
          {product.descripcion && (
            <div
              className={`accordion-item ${
                openSection === "description" ? "open" : ""
              }`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleAccordion("description")}
              >
                DESCRIPCIÓN
                <span
                  className={`arrow ${
                    openSection === "description" ? "rotate" : ""
                  }`}
                >
                  <ChevronDown size={24} color="whitesmoke" />
                </span>
              </div>
              {/* 💡 Usamos style={{ whiteSpace: 'pre-line' }} para respetar los saltos de línea (\n) del JSON */}
              <div className="accordion-body">
                <div style={{ whiteSpace: 'pre-line' }}>
                  {product.descripcion}
                </div>
              </div>
            </div>
          )}

          {/* 🔹 ACORDEÓN DE ESPECIFICACIONES (Mantenido) */}
          <div
            className={`accordion-item ${
              openSection === "specs" ? "open" : ""
            }`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleAccordion("specs")}
            >
              ESPECIFICACIONES
              <span
                className={`arrow ${openSection === "specs" ? "rotate" : ""}`}
              >
                <ChevronDown size={24} color="whitesmoke" />
              </span>
            </div>
            <div className="accordion-body">
              Tipo: {product.tipo} <br />
              Color: {variant?.color?.join(", ")} <br />
              Suela: {product.suela} <br />
              Origen: {product.origen} <br />
              Fabrica: {product.fabrica} <br />
              {product.colaboracion && (
                <>
                  Colaboración: Sí <br />
                </>
              )}
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
      {/* ✅ RENDERIZA el toast solo si es visible */}
      {toast.visible && (
        <ToastNotification message={toast.message} onDismiss={hideToast} />
      )}
    </>
  );
};

export default ProductDetail;