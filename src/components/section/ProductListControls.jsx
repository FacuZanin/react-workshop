import { Funnel, LayoutGrid, List, ArrowUpDown } from "lucide-react";

const ProductListControls = ({
  startIndex,
  endIndex,
  totalProductsCount,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewType,
  setViewType,
  setShowMobileFilter,
}) => {
  return (
    <div className="top-section-info">
      <p>{`Artículos ${startIndex}-${endIndex} de ${totalProductsCount}`}</p>

      <div className="products-controls">
        <div className="products-sort-controls">
          <label htmlFor="sort-by-select" className="sort-label">
            ORDENAR POR
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option value="posicion">Posición</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={() =>
              setSortOrder()
            }
          >
            <ArrowUpDown size={20} />
          </button>
          
        </div>
        <div className="products-view-controls">
          <button
            className={`view-btn ${viewType === "grid" ? "active" : ""}`}
            onClick={() => setViewType("grid")}
          >
            <LayoutGrid size={24} />
          </button>
          <button
            className={`view-btn ${viewType === "list" ? "active" : ""}`}
            onClick={() => setViewType("list")}
          >
            <List size={24} />
          </button>
        </div>
        <div className="mobile-filter-btn-container">
          <button
            className="mobile-filter-btn"
            onClick={() => setShowMobileFilter(true)}
          >
            <Funnel size={20} /> Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductListControls;