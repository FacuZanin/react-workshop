// src/components/section/MobileFilterOverlay.jsx
import React from "react";
import { X } from "lucide-react";
import Filter from "../filter/Filter"; // Necesita el componente Filter

const MobileFilterOverlay = ({
  showMobileFilter,
  setShowMobileFilter,
  onFilterChange,
}) => {
  return (
    <div
      className={`mobile-filter-overlay ${showMobileFilter ? "open" : ""}`}
      onClick={() => setShowMobileFilter(false)}
    >
      {/* Botón de cerrar */}
      <button
        className="mobile-filter-close-btn"
        onClick={() => setShowMobileFilter(false)}
      >
        <X size={24} />
      </button>

      {/* Panel de filtros */}
      <div
        className="mobile-filter-panel"
        // 🛑 Evita que el clic en el panel cierre el overlay
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="mobile-filter-header">
          <h3>Filtros</h3>
        </div>
        <div className="mobile-filter-content">
          {/* Componente Filter */}
          <Filter onFilterChange={onFilterChange} />
        </div>
      </div>
    </div>
  );
};

export default MobileFilterOverlay;