import { X } from "lucide-react";
import Filter from "../filter/Filter";

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
      <button
        className="mobile-filter-close-btn"
        onClick={() => setShowMobileFilter(false)}
      >
        <X size={24} />
      </button>
      <div
        className="mobile-filter-panel"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="mobile-filter-header">
          <h3>Filtros</h3>
        </div>
        <div className="mobile-filter-content">
          <Filter onFilterChange={onFilterChange} />
        </div>
      </div>
    </div>
  );
};

export default MobileFilterOverlay;