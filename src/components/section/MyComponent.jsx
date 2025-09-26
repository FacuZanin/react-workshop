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

  // filtros persistidos en localStorage (comparten key con Filter.jsx)
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
        // filtramos objetos sin variantes (en tu JSON hay entradas tipo { "Fabrica": "Bob" })
        const validProducts = (json || []).filter((p) => Array.isArray(p.variantes));

        // procesamos: generamos una lista plana de variantes con las propiedades necesarias
        const processedData = validProducts.flatMap((producto) =>
          (producto.variantes || []).map((variante) => ({
            ...variante,
            productoId: producto.id || "",
            productoNombre: producto.nombre || "",
            productoMarca: producto.marca || "",
            productoTipo: producto.tipo || "",
            precioCaja: producto.precioCaja ?? 0,
            fabrica: producto.fabrica ?? producto.Fabrica ?? "",
            suela: producto.suela ?? producto.suela ?? "",
            origen: producto.origen ?? "",
            precioSinCaja: producto.precioSinCaja ?? "",
            colaboracion: !!producto.colaboracion,
            // garantizamos arrays
            talles: variante.talles || [],
            color: variante.color || [],
          }))
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

  // helper: compara campo de variante (string o array) con valores seleccionados (array)
  const matches = (variantField, selectedValues) => {
    if (!selectedValues || selectedValues.length === 0) return true;
    if (variantField === undefined || variantField === null) return false;

    if (Array.isArray(variantField)) {
      return variantField.some((v) => selectedValues.includes(v));
    }
    // string / number
    return selectedValues.includes(String(variantField));
  };

  // filtro especial para "otros" (Con caja / Sin caja / Colaboración)
  const matchOtros = (variante, selectedOtros) => {
    if (!selectedOtros || selectedOtros.length === 0) return true;
    return selectedOtros.some((opt) => {
      if (opt === "Con caja") return !!String(variante.precioCaja).trim();
      if (opt === "Sin caja") return !String(variante.precioSinCaja).trim();
      if (opt === "Colaboración") return !!variante.colaboracion;
      return false;
    });
  };

  // ordenamiento
  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      if (sortBy === "nombre") {
        const nombreA = (a.productoNombre || "").toLowerCase();
        const nombreB = (b.productoNombre || "").toLowerCase();
        return sortOrder === "asc" ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
      }
      if (sortBy === "precio") {
        const aVal = Number(a.precioCaja || 0);
        const bVal = Number(b.precioCaja || 0);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      // fallback por posicion si existiera, sino mantener orden original
      const aPos = Number(a.posicion ?? Infinity);
      const bPos = Number(b.posicion ?? Infinity);
      return sortOrder === "asc" ? aPos - bPos : bPos - aPos;
    });
  };

  // filtrado — usamos matches para manejar arrays/strings
  const filteredProducts = data.filter((variante) => {
    const filterByTalle = matches(variante.talles, filters.talle);
    const filterByColor = matches(variante.color, filters.color);
    const filterByTipo = matches(variante.productoTipo, filters.tipo);
    const filterByFabrica = matches(variante.fabrica, filters.fabrica);
    const filterBySuela = matches(variante.suela, filters.suela);
    const filterByMaterial = matches(variante.material, filters.material);
    const filterByMarca = matches(variante.productoMarca || variante.productoMarca, filters.marca);
    const filterByOrigen = matches(variante.origen, filters.origen);
    const filterByOtros = matchOtros(variante, filters.otros);

    return (
      filterByTalle &&
      filterByColor &&
      filterByTipo &&
      filterByFabrica &&
      filterBySuela &&
      filterByMaterial &&
      filterByMarca &&
      filterByOrigen &&
      filterByOtros
    );
  });

  const sortedProducts = sortProducts(filteredProducts);

  const totalProductsCount = sortedProducts.length;
  const totalPages = Math.ceil(totalProductsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(startIndex + productsPerPage - 1, totalProductsCount);
  const paginatedProducts = sortedProducts.slice(startIndex - 1, endIndex);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container">
      <div className="desktop-filter">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      <div className="products-content">
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
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="posicion">Posición</option>
                <option value="nombre">Nombre</option>
                <option value="precio">Precio</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown size={20} />
              </button>
            </div>

            <div className="products-view-controls">
              <button className={`view-btn ${viewType === "grid" ? "active" : ""}`} onClick={() => setViewType("grid")}>
                <LayoutGrid size={24} />
              </button>
              <button className={`view-btn ${viewType === "list" ? "active" : ""}`} onClick={() => setViewType("list")}>
                <List size={24} />
              </button>
            </div>

            <div className="mobile-filter-btn-container">
              <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
                <Funnel size={20} /> Filtros
              </button>
            </div>
          </div>
        </div>

        <Section products={paginatedProducts} viewType={viewType} />

        {totalPages > 1 && (
          <div className="bottom-controls-container">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            <div className="products-per-page-control">
              <label htmlFor="products-per-page-select">MOSTRAR</label>
              <select id="products-per-page-select" value={productsPerPage} onChange={handleProductsPerPageChange}>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
              <label htmlFor="products-per-page-select">POR PÁGINA</label>
            </div>
          </div>
        )}
      </div>

      <div className={`mobile-filter-overlay ${showMobileFilter ? "open" : ""}`} onClick={() => setShowMobileFilter(false)}>
        <button className="mobile-filter-close-btn" onClick={() => setShowMobileFilter(false)}>
          <X size={24} />
        </button>

        <div className="mobile-filter-panel" onClick={(e) => e.stopPropagation()}>
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
