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
  const [openSection, setOpenSection] = useState("");
  const { toast, hideToast } = useCarrito(); // ✅ Obtiene el estado del toast

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p) => String(p.id) === String(id));
        if (foundProduct) {
          setProduct(foundProduct);
          let selectedVariant = null;

          if (foundProduct.variantes && foundProduct.variantes.length > 0) {
            const foundVariant = foundProduct.variantes.find(
              (v) => String(v.id) === String(variantId)
            );
            selectedVariant = foundVariant || foundProduct.variantes[0];
          }

          if (selectedVariant && selectedVariant.distribucion) {
            const tallesArray = Object.keys(selectedVariant.distribucion).map(
              (talle) => ({
                talle: talle,
                distribucion: selectedVariant.distribucion[talle],
              })
            );
            setVariant({ ...selectedVariant, talles: tallesArray });
          } else if (foundProduct.distribucion) {
            const tallesArray = Object.keys(foundProduct.distribucion).map(
              (talle) => ({
                talle: talle,
                distribucion: foundProduct.distribucion[talle],
              })
            );
            setVariant({ ...foundProduct, talles: tallesArray });
          } else {
            setVariant({});
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
          <div
            className={`accordion-item ${
              openSection === "specs" ? "open" : ""
            }`}
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
                <ChevronDown size={24} color="whitesmoke" />
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
      {/* ✅ RENDERIZA el toast solo si es visible */}
      {toast.visible && <ToastNotification message={toast.message} onDismiss={hideToast} />}
    </>
  );
};

export default ProductDetail;