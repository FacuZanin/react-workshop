import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import Loader from "../common/Loader";
import Filter from "../filter/Filter";
import "./MyComponent.css";
import { Funnel, X, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Pagination from "./Pagination";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const productsContainerRef = useRef(null);
  const [filters, setFilters] = useLocalStorage("filters", {});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(24);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("posicion");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch("/data/productos.json")
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar datos");
        return response.json();
      })
      .then((json) => {
        const validProducts = json.filter(producto => producto.variantes);

        const processedData = validProducts.flatMap((producto) =>
          producto.variantes.length > 0
            ? producto.variantes.map((variante) => ({
                ...variante,
                productoId: producto.id,
                productoNombre: producto.nombre,
                productoMarca: producto.marca,
                productoTipo: producto.tipo,
                precioCaja: producto.precioCaja,
                fabrica: producto.fabrica,
                origen: producto.origen,
              }))
            : []
        );
        setData(processedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const sortProducts = (products) => {
    const sorted = [...products].sort((a, b) => {
      let aValue, bValue;
      if (sortBy === "nombre") {
        aValue = a.productoNombre.toLowerCase();
        bValue = b.productoNombre.toLowerCase();
      } else if (sortBy === "precio") {
        aValue = a.productoPrecios.find((p) => p.tipo === "mayorista").precio;
        bValue = b.productoPrecios.find((p) => p.tipo === "mayorista").precio;
      } else {
        aValue = a.posicion || Infinity;
        bValue = b.posicion || Infinity;
      }

      if (sortOrder === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    });
    return sorted;
  };

  const filteredProducts = data.filter((variante) => {
    const filterByTalle = filters.talle
      ? variante.talles?.includes(filters.talle)
      : true;
    const filterByColor = filters.color
      ? variante.color?.includes(filters.color)
      : true;
    const filterByTipo = filters.tipo
      ? variante.productoTipo?.includes(filters.tipo)
      : true;
    const filterByFabrica = filters.fabrica
      ? variante.fabrica?.includes(filters.fabrica)
      : true;
    const filterBySuela = filters.suela
      ? variante.suela?.includes(filters.suela)
      : true;
    const filterByMaterial = filters.material
      ? variante.material?.includes(filters.material)
      : true;
    const filterByMarca = filters.marca
      ? variante.productoMarca?.includes(filters.marca)
      : true;

    return (
      filterByTalle &&
      filterByColor &&
      filterByTipo &&
      filterByFabrica &&
      filterBySuela &&
      filterByMaterial &&
      filterByMarca
    );
  });

  const sortedProducts = sortProducts(filteredProducts);

  const totalProductsCount = sortedProducts.length;
  const totalPages = Math.ceil(totalProductsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(startIndex + productsPerPage - 1, totalProductsCount);

  const paginatedProducts = sortedProducts.slice(startIndex - 1, endIndex);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-container">
      <div className="desktop-filter">
        <Filter onFilterChange={handleFilterChange} />
      </div>
      <div className="products-content">
        <div className="top-section-info">
          {/* ✅ CORRECCIÓN: Usamos las nuevas variables para mostrar el mensaje dinámico */}
          <p>{`Artículos ${startIndex}-${endIndex} de ${totalProductsCount}`}</p>
          <div className="products-controls">
            <div className="products-sort-controls">
              <label htmlFor="sort-by-select" className="sort-label">
                ORDENAR POR
              </label>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="posicion">Posición</option>
                <option value="nombre">Nombre</option>
                <option value="precio">Precio</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
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

        <Section products={paginatedProducts} viewType={viewType} />

        {totalPages > 1 && (
          <div className="bottom-controls-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="products-per-page-control">
              <label htmlFor="products-per-page-select">MOSTRAR</label>
              <select
                id="products-per-page-select"
                value={productsPerPage}
                onChange={handleProductsPerPageChange}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
              <label htmlFor="products-per-page-select">POR PÁGINA</label>
            </div>
          </div>
        )}
      </div>

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
            <Filter onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;