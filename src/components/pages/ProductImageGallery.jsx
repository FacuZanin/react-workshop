import { useState, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductImageGallery.css'; 

const ZOOM_FACTOR = 2.5; // Factor de amplificación para el zoom

/**
 * Componente de galería de imágenes con navegación y funcionalidad de zoom.
 * @param {object} props - Propiedades del componente.
 * @param {string[]} props.images - Array de URLs de las imágenes del producto.
 * @param {string} props.productName - Nombre del producto para el alt text.
 * @param {number} props.zoomSize - Tamaño (ancho/alto en px) del contenedor de zoom.
 * @returns {JSX.Element}
 */
const ProductImageGallery = ({ images, productName, zoomSize = 400 }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    
    // Referencia al contenedor principal para calcular las posiciones.
    const imageContainerRef = useRef(null);
    
    // Memoizamos para evitar re-cálculos costosos si las imágenes no cambian
    const hasMultipleImages = useMemo(() => images && images.length > 1, [images]);

    if (!images || images.length === 0) {
        return <div className="image-gallery placeholder">No hay imágenes disponibles.</div>;
    }

    const currentImageUrl = images[currentImageIndex];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleMouseMove = (e) => {
        if (!imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        
        // Posición del ratón dentro del contenedor de la imagen
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Porcentaje de la posición (0 a 1)
        const xPercent = (x / rect.width);
        const yPercent = (y / rect.height);
        
        // Posición para el fondo del zoom (aplicando el factor de amplificación)
        // Se multiplica por -1 para que la imagen se mueva en dirección contraria al cursor
        const backgroundX = -(xPercent * 100 * ZOOM_FACTOR);
        const backgroundY = -(yPercent * 100 * ZOOM_FACTOR);

        setZoomPosition({ x: backgroundX, y: backgroundY });
    };

    const handleMouseEnter = () => {
        if (images.length === 0) return;
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const zoomStyle = {
        backgroundImage: `url(${currentImageUrl})`,
        backgroundSize: `${ZOOM_FACTOR * 100}% ${ZOOM_FACTOR * 100}%`,
        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
        width: `${zoomSize}px`, // El tamaño del zoom se define en las props
        height: `${zoomSize}px`,
        // Calculamos el desplazamiento del zoom para que aparezca junto al componente principal
        transform: `translateX(calc(100% + 20px))` // Desplazar 100% a la derecha + 20px de margen
    };


    return (
        <div className="image-gallery-wrapper">
            {/* Contenedor Principal de la Imagen */}
            <div 
                className="image-container"
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Flechas de navegación (solo si hay más de una imagen) */}
                {hasMultipleImages && (
                    <>
                        <button className="nav-arrow left" onClick={prevImage} aria-label="Anterior imagen">
                            <ChevronLeft size={24} />
                        </button>
                        <img 
                            src={currentImageUrl} 
                            alt={`${productName} - Vista ${currentImageIndex + 1}`} 
                            className="product-main-image"
                        />
                        <button className="nav-arrow right" onClick={nextImage} aria-label="Siguiente imagen">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Si solo hay una imagen */}
                {!hasMultipleImages && (
                    <img 
                        src={currentImageUrl} 
                        alt={`${productName}`} 
                        className="product-main-image"
                    />
                )}
            </div>

            {/* Contenedor del Zoom (se muestra solo en hover) */}
            {isZooming && (
                <div 
                    className="zoom-view-overlay" 
                    style={zoomStyle}
                />
            )}
        </div>
    );
};

export default ProductImageGallery;