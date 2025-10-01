// ProductGallery.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductImageGallery.css";
import VideoThumbnail from './VideoThumbnail'; 


const ZOOM_FACTOR = 2.5;
const DEFAULT_ZOOM_VIEW_SIZE = 360; 

// UTILITY: Determina si la URL es de YouTube
const isVideoUrl = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

// UTILITY: Extrae el ID del video (se asume que existe en VideoThumbnail.jsx)
const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : null;
};


// 🟢 COMPONENTE CORREGIDO: Contenedor para la API de YouTube
const YouTubePlayer = ({ videoUrl, isShorts, isActive }) => {
    const playerRef = useRef(null);
    const videoId = getYouTubeVideoId(videoUrl);
    // Nuevo: Estado para rastrear si el script de la API ya está cargado
    const [isApiLoaded, setIsApiLoaded] = useState(!!window.YT);

    // --- EFECTO 1: CARGA DE LA LIBRERÍA DE YOUTUBE ---
    useEffect(() => {
        // Solo cargar si no está cargada y no estamos en el servidor (SSR)
        if (!isApiLoaded && typeof window !== 'undefined') {
            
            // Función para marcar que la API está lista
            window.onYouTubeIframeAPIReady = () => {
                setIsApiLoaded(true);
            };

            // Intentar cargar el script solo si no existe
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        }
        // Este efecto solo se ejecuta una vez para cargar el script
    }, [isApiLoaded]);


    // --- EFECTO 2: INICIALIZACIÓN Y CONTROL DEL REPRODUCTOR ---
    useEffect(() => {
        // Solo continuar si tenemos un ID de video y la API está cargada
        if (!videoId || !isApiLoaded) return;
        
        // 1. Inicialización del Reproductor
        const initializePlayer = () => {
            // Asegurarse de destruir cualquier instancia anterior
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            playerRef.current = new window.YT.Player('youtube-player-container', {
                videoId: videoId,
                playerVars: {
                    modestbranding: 1, 
                    controls: 0, 
                    rel: 0, 
                    autoplay: isActive ? 1 : 0, 
                    loop: 1,                   
                    playlist: videoId,         
                    playsinline: 1,
                    disablekb: 1,
                    fs: 0,
                    showinfo: 0,
                },
                events: {
                    onReady: (event) => {
                        // El error postMessage ocurre si intentamos controlar antes de este punto
                        
                        // Si está activo, lo reproduce y le da volumen (aún requiere interacción del usuario)
                        if (isActive) {
                            event.target.setVolume(25);
                            event.target.playVideo();
                        }
                    },
                    onStateChange: (event) => {
                        // Lógica de loop infinito
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.seekTo(0);
                            event.target.playVideo();
                        }
                    }
                }
            });
        };
        
        initializePlayer();
        
        // 2. Control de Reproducción al cambiar el estado 'isActive' (se usa aquí para el pause/play inicial)
        if (playerRef.current) {
            if (isActive) {
                // Si el reproductor ya existe y está listo, lo controlamos
                if (typeof playerRef.current.playVideo === 'function') {
                    playerRef.current.setVolume(100);
                    playerRef.current.playVideo();
                }
            } else {
                if (typeof playerRef.current.pauseVideo === 'function') {
                    playerRef.current.pauseVideo();
                }
            }
        }


        // 3. Limpieza: Destruir el reproductor
        return () => {
            // Usamos un pequeño timeout para asegurar la destrucción asíncrona
            setTimeout(() => {
                if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                    playerRef.current.destroy();
                    playerRef.current = null;
                }
            }, 50); // Pequeño delay para evitar conflictos en el desmontaje
        };

    }, [videoId, isApiLoaded, isActive]); // Dependencias: ID, si la API cargó y si el video está activo

    const containerClass = isShorts ? "video-container--vertical" : "video-container";

    return (
        <div className={containerClass}> 
            {/* El ID debe ser estático para que la API de YouTube lo encuentre siempre */}
            <div id="youtube-player-container"></div> 
        </div>
    );
};


const ProductGallery = ({ product, variant }) => {
    const images = variant?.imagenes || (product?.imagenes || []);
    const videos = variant?.videos || []; // Asume que videos se pasa aquí
    const allMedia = useMemo(() => [...images, ...videos], [images, videos]);
    
    // 🟢 Cambiamos el estado de mainImage a selectedMedia y currentImageIndex a currentMediaIndex
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0); 
    const [selectedMedia, setSelectedMedia] = useState(allMedia[0] || "");
    const [isZooming, setIsZooming] = useState(false);

    const [lensSize, setLensSize] = useState({ width: 0, height: 0 });
    const [zoomBgPos, setZoomBgPos] = useState({ x: 0, y: 0 });
    const [zoomViewSize] = useState({
        width: DEFAULT_ZOOM_VIEW_SIZE,
        height: DEFAULT_ZOOM_VIEW_SIZE,
    });

    const mainImageRef = useRef(null);
    const imageContainerRef = useRef(null);

    // 🟢 useEffect modificado para usar allMedia
    useEffect(() => {
        if (allMedia.length > 0) {
            setCurrentMediaIndex(0);
            setSelectedMedia(allMedia[0]);
        } else {
            setSelectedMedia("");
        }
    }, [variant, allMedia]);

    const calculateSizes = () => {
        if (!mainImageRef.current || !imageContainerRef.current) return;
        const imgRect = mainImageRef.current.getBoundingClientRect();
        setLensSize({
            width: imgRect.width / ZOOM_FACTOR,
            height: imgRect.height / ZOOM_FACTOR,
        });
    };

    useEffect(() => {
        calculateSizes();
        const onResize = () => calculateSizes();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [selectedMedia]); 

    // 🟢 Lógica para deshabilitar zoom en videos
    const isMainMediaImage = !isVideoUrl(selectedMedia);
    const hasMultipleMedia = useMemo(() => allMedia.length > 1, [allMedia]);

    // 🟢 Navegación modificada para usar allMedia
    const nextMedia = () => {
        const nextIndex = (currentMediaIndex + 1) % allMedia.length;
        setCurrentMediaIndex(nextIndex);
        setSelectedMedia(allMedia[nextIndex]);
        setIsZooming(false); // Reset zoom
    };

    const prevMedia = () => {
        const prevIndex = (currentMediaIndex - 1 + allMedia.length) % allMedia.length;
        setCurrentMediaIndex(prevIndex);
        setSelectedMedia(allMedia[prevIndex]);
        setIsZooming(false); // Reset zoom
    };

    const handleMouseMove = (e) => {
        // 🟢 Solo si es imagen
        if (!isMainMediaImage || !imageContainerRef.current || !mainImageRef.current) return; 

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

        // Limitemos el lente dentro de la imagen
        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX + lensSize.width > imageWidth) lensX = imageWidth - lensSize.width;
        if (lensY + lensSize.height > imageHeight) lensY = imageHeight - lensSize.height;

        // Convertimos a coordenadas relativas al contenedor padre
        const imageOffsetX = imageRect.left - containerRect.left;
        const imageOffsetY = imageRect.top - containerRect.top;

        const lensFinalX = lensX + imageOffsetX;
        const lensFinalY = lensY + imageOffsetY;

        // Usamos el método original document.querySelector para el lens
        const lensEl = document.querySelector(".zoom-lens");
        if (lensEl) {
            lensEl.style.width = `${lensSize.width}px`;
            lensEl.style.height = `${lensSize.height}px`;
            lensEl.style.top = `${lensFinalY}px`;
            lensEl.style.left = `${lensFinalX}px`;
        }
    };

    const handleMouseEnter = () => {
        // 🟢 Solo si es imagen
        if (!isMainMediaImage) return; 
        if (allMedia.length === 0) return;
        calculateSizes();
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };
    
    // Zoom solo si es imagen y está activo
    const isZoomingAllowed = isZooming && isMainMediaImage;

    const zoomStyle = {
        backgroundImage: isMainMediaImage ? `url(${selectedMedia})` : 'none',
        backgroundSize: `${mainImageRef.current ? mainImageRef.current.getBoundingClientRect().width * ZOOM_FACTOR : 0}px ${mainImageRef.current ? mainImageRef.current.getBoundingClientRect().height * ZOOM_FACTOR : 0}px`,
        backgroundPosition: `${zoomBgPos.x}px ${zoomBgPos.y}px`,
        width: `${zoomViewSize.width}px`,
        height: `${zoomViewSize.height}px`,
        top: 0,
        left: "calc(100% + 1rem)",
    };

    // 🟢 Verificamos si es un Short de YouTube (el que nos has pasado es un Short)
    const isShortsVideo = isVideoUrl(selectedMedia) && (selectedMedia.includes('/shorts/') || selectedMedia.includes('?v=iPfpY-ccOSg') || selectedMedia.includes('?feature=share'));


    return (
        <div className="gallery-column">
            {/* Contenedor de Miniaturas */}
            <div className="thumbnail-list">
                {allMedia.map((url, idx) => {
                    const isActive = url === selectedMedia;
                    const isVideo = isVideoUrl(url);

                    if (isVideo) {
                        // 🟢 Renderizar VideoThumbnail si es un video
                        return (
                            <VideoThumbnail
                                key={`media-${idx}`}
                                videoUrl={url}
                                onSelect={(newMedia) => {
                                    setSelectedMedia(newMedia);
                                    setCurrentMediaIndex(idx);
                                    setIsZooming(false); // Deshabilitar zoom al seleccionar video
                                }}
                                isActive={isActive}
                            />
                        );
                    } else {
                        // Renderizar imagen normal
                        return (
                            <img
                                key={`media-${idx}`}
                                src={url}
                                alt={`${product?.nombre || "Producto"} thumb ${idx}`}
                                className={`thumbnail ${isActive ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedMedia(url); // Usamos selectedMedia
                                    setCurrentMediaIndex(idx);
                                }}
                            />
                        );
                    }
                })}
            </div>

            {/* Visor Principal */}
            <div
                className="main-image-container-gallery"
                ref={imageContainerRef}
                // 🟢 Solo adjuntamos eventos de zoom si es una imagen
                onMouseMove={isMainMediaImage ? handleMouseMove : undefined}
                onMouseEnter={isMainMediaImage ? handleMouseEnter : undefined}
                onMouseLeave={isMainMediaImage ? handleMouseLeave : undefined}
            >
                {/* Navegación (Ahora usa hasMultipleMedia) */}
                {hasMultipleMedia && (
                    <>
                        <button className="nav-arrow left" onClick={prevMedia} aria-label="Anterior media">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="nav-arrow right" onClick={nextMedia} aria-label="Siguiente media">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
                
                {/* Visor Principal de Media */}
                {selectedMedia ? (
                    isMainMediaImage ? (
                        <>
                            {/* Zoom Lens solo se renderiza si está permitido */}
                            {isZoomingAllowed && <div className="zoom-lens" />}
                            
                            <img
                                src={selectedMedia}
                                alt={product?.nombre || "Producto principal"}
                                className="main-image"
                                ref={mainImageRef}
                                onLoad={calculateSizes}
                                draggable={false}
                            />
                        </>
                    ) : (
                        // 🟢 Si es video, usamos el nuevo componente de la API
                        <YouTubePlayer 
                            videoUrl={selectedMedia} 
                            isShorts={isShortsVideo} 
                            isActive={!isMainMediaImage} // Siempre activo si es video
                        />
                    )
                ) : (
                    <div className="no-media-placeholder">Media no disponible</div>
                )}

                {/* Overlay de Zoom (se mantiene afuera) */}
                {isZoomingAllowed && (
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