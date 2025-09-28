// ProductGallery.jsx (REEMPLAZAR)
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductImageGallery.css";

const ZOOM_FACTOR = 2.5; // Factor de amplificación.
const DEFAULT_ZOOM_VIEW_SIZE = 360; // Tamaño del overlay (px)

const ProductGallery = ({ product, variant }) => {
  const images = variant?.imagenes || (product?.imagenes || []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImage, setMainImage] = useState(images[0] || "");
  const [isZooming, setIsZooming] = useState(false);

  // Posición del "lente" en el contenedor (px)
  const [lensSize, setLensSize] = useState({ width: 0, height: 0 });

  // Posición del overlay background (px negativos) — lo aplicamos en px para evitar desalineos
  const [zoomBgPos, setZoomBgPos] = useState({ x: 0, y: 0 });
  const [zoomViewSize, setZoomViewSize] = useState({
    width: DEFAULT_ZOOM_VIEW_SIZE,
    height: DEFAULT_ZOOM_VIEW_SIZE,
  });

  const mainImageRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    if (images.length > 0) {
      setCurrentImageIndex(0);
      setMainImage(images[0]);
    } else {
      setMainImage("");
    }
  }, [variant, images]);

  // Recalcula tamaños en load y en resize del viewport
  const calculateSizes = () => {
    if (!mainImageRef.current || !imageContainerRef.current) return;
    const imgRect = mainImageRef.current.getBoundingClientRect();
    // Tamaño del "lente" en pantalla: proporcional al zoom factor
    setLensSize({
      width: imgRect.width / ZOOM_FACTOR,
      height: imgRect.height / ZOOM_FACTOR,
    });

    // Si deseas que el overlay tenga un tamaño relativo al contenedor,
    // podrías cambiar la lógica aquí. Mantengo un tamaño fijo por UX.
    // setZoomViewSize({ width: imgRect.width * 0.9, height: imgRect.height * 0.9 });
  };

  useEffect(() => {
    // recalcular cuando cambie la imagen
    calculateSizes();
    // recalcular en resize
    const onResize = () => calculateSizes();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line
  }, [mainImage]);

  const hasMultipleImages = useMemo(() => images.length > 1, [images]);

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setMainImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setMainImage(images[prevIndex]);
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current || !mainImageRef.current) return;

    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const imageRect = mainImageRef.current.getBoundingClientRect();

    // Posición del mouse relativa a la imagen (px)
    const mouseImageX = e.clientX - imageRect.left;
    const mouseImageY = e.clientY - imageRect.top;

    // Tamaños en px de la imagen renderizada
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;

    // Size del background (imagen ampliada) en px:
    const bgWidth = imageWidth * ZOOM_FACTOR;
    const bgHeight = imageHeight * ZOOM_FACTOR;

    // Queremos centrar en el overlay la parte ampliada bajo el cursor:
    // Calculamos la posición superior izquierda del background que debe mostrarse
    const zoomW = zoomViewSize.width;
    const zoomH = zoomViewSize.height;

    // Punto en la imagen ampliada equivalente al cursor
    let bgCenterX = mouseImageX * ZOOM_FACTOR;
    let bgCenterY = mouseImageY * ZOOM_FACTOR;

    // Convertir a la posición superior izquierda del background que se colocará en el overlay:
    let bgX = bgCenterX - zoomW / 2;
    let bgY = bgCenterY - zoomH / 2;

    // Clamp para que no se salga del área disponible del background
    if (bgX < 0) bgX = 0;
    if (bgY < 0) bgY = 0;
    if (bgX + zoomW > bgWidth) bgX = bgWidth - zoomW;
    if (bgY + zoomH > bgHeight) bgY = bgHeight - zoomH;

    // Guardamos el valor negativo que debe usarse como background-position (px)
    setZoomBgPos({ x: -bgX, y: -bgY });

    // Calculamos y posicionamos el "lente" visual (centrado en cursor)
    const halfLensW = lensSize.width / 2;
    const halfLensH = lensSize.height / 2;

    let lensX = mouseImageX - halfLensW;
    let lensY = mouseImageY - halfLensH;

    // Limitamos el lente dentro de la imagen
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX + lensSize.width > imageWidth) lensX = imageWidth - lensSize.width;
    if (lensY + lensSize.height > imageHeight) lensY = imageHeight - lensSize.height;

    // Convertimos a coordenadas relativas al contenedor padre
    const imageOffsetX = imageRect.left - containerRect.left;
    const imageOffsetY = imageRect.top - containerRect.top;

    const lensFinalX = lensX + imageOffsetX;
    const lensFinalY = lensY + imageOffsetY;

    // Actualizamos el estilo usando transform para suavidad
    const lensEl = document.querySelector(".zoom-lens");
    if (lensEl) {
      lensEl.style.width = `${lensSize.width}px`;
      lensEl.style.height = `${lensSize.height}px`;
      lensEl.style.top = `${lensFinalY}px`;
      lensEl.style.left = `${lensFinalX}px`;
    }
  };

  const handleMouseEnter = () => {
    if (images.length === 0) return;
    calculateSizes();
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Style del overlay con background en PIXELES (esto corrige el bug de "solo esquina superior izquierda")
  const zoomStyle = {
    backgroundImage: `url(${mainImage})`,
    backgroundSize: `${mainImageRef.current ? mainImageRef.current.getBoundingClientRect().width * ZOOM_FACTOR : 0}px ${mainImageRef.current ? mainImageRef.current.getBoundingClientRect().height * ZOOM_FACTOR : 0}px`,
    backgroundPosition: `${zoomBgPos.x}px ${zoomBgPos.y}px`,
    width: `${zoomViewSize.width}px`,
    height: `${zoomViewSize.height}px`,
    top: 0,
    left: "calc(100% + 1rem)",
  };

  return (
    <div className="gallery-column">
      <div className="thumbnail-list">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product?.nombre || "Producto"} thumb ${idx}`}
            className={`thumbnail ${img === mainImage ? "active" : ""}`}
            onClick={() => {
              setMainImage(img);
              setCurrentImageIndex(idx);
            }}
          />
        ))}
      </div>

      <div
        className="main-image-container-gallery"
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasMultipleImages && (
          <>
            <button className="nav-arrow left" onClick={prevImage} aria-label="Anterior imagen">
              <ChevronLeft size={24} />
            </button>
            <button className="nav-arrow right" onClick={nextImage} aria-label="Siguiente imagen">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {mainImage && (
          <img
            src={mainImage}
            alt={product?.nombre || "Producto principal"}
            className="main-image"
            ref={mainImageRef}
            onLoad={calculateSizes}
            draggable={false}
          />
        )}

        {isZooming && <div className="zoom-lens" />}

        {isZooming && (
          <div
            className="zoom-view-overlay"
            style={zoomStyle}
          />
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
