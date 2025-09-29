import React, { useState, useEffect, useRef } from "react";
import Section from "./Section"; // Mantiene la importación para renderizar los productos
import Loader from "../common/Loader";
import Filter from "../filter/Filter";
import ProductListControls from "./ProductListControls"; // 👈 Nuevo componente
import ProductListFooter from "./ProductListFooter"; // 👈 Nuevo componente
import MobileFilterOverlay from "./MobileFilterOverlay"; // 👈 Nuevo componente
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./MyComponent.css"; // Mantenemos el CSS existente

const ProductList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const productsContainerRef = useRef(null);

  // Estados persistidos y de control
  const [filters, setFilters] = useLocalStorage("filters", {});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(24);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("posicion");
  const [sortOrder, setSortOrder] = useState("asc");

  // useEffect para cargar los datos (Se mantiene igual)
  useEffect(() => {
    fetch("/data/productos.json")
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar datos");
        return response.json();
      })
      .then((json) => {
        const validProducts = (json || []).filter((p) => Array.isArray(p.variantes));

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

  // Handlers (Se mantienen para modificar el estado central)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // ✅ CAMBIO CLAVE: Usamos la referencia para hacer scroll al inicio de la lista
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // Asegura que el contenedor aparezca en la parte superior visible
      });
    } else {
      // Fallback por si la referencia no está disponible
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Helper de filtrado (Se mantiene igual)
  const matches = (variantField, selectedValues) => {
    if (!selectedValues || selectedValues.length === 0) return true;
    if (variantField === undefined || variantField === null) return false;

    if (Array.isArray(variantField)) {
      return variantField.some((v) => selectedValues.includes(v));
    }
    return selectedValues.includes(String(variantField));
  };

  // Helper de filtro 'Otros' (Se mantiene igual)
  const matchOtros = (variante, selectedOtros) => {
    if (!selectedOtros || selectedOtros.length === 0) return true;
    return selectedOtros.some((opt) => {
      if (opt === "Con caja") return !!String(variante.precioCaja).trim();
      if (opt === "Sin caja") return !String(variante.precioSinCaja).trim();
      if (opt === "Colaboración") return !!variante.colaboracion;
      return false;
    });
  };

  // Lógica de ordenamiento (Se mantiene igual)
  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      if (sortBy === "nombre") {
        const nombreA = (a.productoMarca + " " + a.productoNombre).toLowerCase();
        const nombreB = (b.productoMarca + " " + b.productoNombre).toLowerCase();
        return sortOrder === "asc"
          ? nombreA.localeCompare(nombreB, "es", { sensitivity: "base" })
          : nombreB.localeCompare(nombreA, "es", { sensitivity: "base" });
      }

      if (sortBy === "precio") {
        const aVal = Number(a.precioCaja || 0);
        const bVal = Number(b.precioCaja || 0);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aPos = Number(a.posicion ?? Infinity);
      const bPos = Number(b.posicion ?? Infinity);
      return sortOrder === "asc" ? aPos - bPos : bPos - aPos;
    });
  };

  // Filtrado de productos (Se mantiene igual)
  const filteredProducts = data.filter((variante) => {
    const filterByTalle = matches(variante.talles, filters.talle);
    const filterByColor = matches(variante.color, filters.color);
    const filterByTipo = matches(variante.productoTipo, filters.tipo);
    const filterByFabrica = matches(variante.fabrica, filters.fabrica);
    const filterBySuela = matches(variante.suela, filters.suela);
    const filterByMaterial = matches(variante.material, filters.material);
    const filterByMarca = matches(
      variante.productoMarca || variante.productoMarca,
      filters.marca
    );
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

  // Lógica de paginación (Se mantiene igual)
  const totalProductsCount = sortedProducts.length;
  const totalPages = Math.ceil(totalProductsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(
    startIndex + productsPerPage - 1,
    totalProductsCount
  );
  const paginatedProducts = sortedProducts.slice(startIndex - 1, endIndex);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container">
      {/* Filtro de escritorio (Se mantiene aquí por el layout) */}
      <div className="desktop-filter">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      <div className="products-content" ref={productsContainerRef}>
        {/* Controles superiores (¡Nuevo componente!) */}
        <ProductListControls
          startIndex={startIndex}
          endIndex={endIndex}
          totalProductsCount={totalProductsCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
          viewType={viewType}
          setViewType={setViewType}
          setShowMobileFilter={setShowMobileFilter} // Para abrir el filtro móvil
        />

        {/* Renderizado de productos (Componente existente) */}
        <Section products={paginatedProducts} viewType={viewType} />

        {/* Controles inferiores / Paginación (¡Nuevo componente!) */}
        {totalPages > 1 && (
          <ProductListFooter
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            productsPerPage={productsPerPage}
            onProductsPerPageChange={handleProductsPerPageChange}
          />
        )}
      </div>

      {/* Overlay de filtro móvil (¡Nuevo componente!) */}
      <MobileFilterOverlay
        showMobileFilter={showMobileFilter}
        setShowMobileFilter={setShowMobileFilter}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default ProductList;