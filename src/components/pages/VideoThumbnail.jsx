// VideoThumbnail.jsx
import { Play } from "lucide-react";
import React from 'react';

/**
 * Función auxiliar para extraer el ID del video de YouTube.
 */
const getYouTubeVideoId = (url) => {
    // Patrón para capturar el ID de video (funciona con watch, shorts, youtu.be, etc.)
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
  
    if (match && match[2]?.length === 11) {
      return match[2];
    }
    return null;
};


/**
 * Componente que renderiza la miniatura de un video de YouTube.
 */
const VideoThumbnail = ({ videoUrl, onSelect, isActive }) => {
    
    const videoId = getYouTubeVideoId(videoUrl);
    
    if (!videoId) {
        return null; 
    }
    
    // Generamos la URL de la miniatura de YouTube
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    const containerClasses = `thumbnail video-thumbnail ${isActive ? 'active' : ''}`;

    return (
        <div 
            className={containerClasses} 
            onClick={() => onSelect(videoUrl)}
            role="button"
            aria-label="Reproducir video del producto"
            title="Ver video"
        >
            <img 
                src={thumbnailUrl} 
                alt="Miniatura de video de YouTube del producto" 
                className="thumbnail-img" 
                loading="lazy"
            />
            {/* Overlay para el icono de Play */}
            <div className="play-icon-overlay">
                <Play size={30} fill="white" strokeWidth={0} />
            </div>
        </div>
    );
};

export default VideoThumbnail;