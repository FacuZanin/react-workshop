// src/components/section/ProductList.jsx - VERSIÓN FINAL DEFINITIVA

import React, { useState, useEffect, useRef, useCallback } from "react";
import Section from "./Section";
import Loader from "../common/Loader";
import Filter from "../filter/Filter";
import ProductListControls from "./ProductListControls";
import ProductListFooter from "./ProductListFooter";
import MobileFilterOverlay from "./MobileFilterOverlay";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSearchParams } from "react-router-dom";
import "./MyComponent.css";

// Función para comparar objetos JSON (para la lógica de filtros)
const areFiltersEqual = (obj1, obj2) => {
  if (!obj1 || !obj2) return obj1 === obj2;
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

const ProductList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const productsContainerRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = parseInt(pageParam) > 0 ? parseInt(pageParam) : 1;

  const [filters, setFilters] = useLocalStorage("filters", {});
  const [productsPerPage, setProductsPerPage] = useLocalStorage(
    "productsPerPage",
    24
  );
  const [viewType, setViewType] = useLocalStorage("viewType", "grid");
  const [sortBy, setSortBy] = useLocalStorage("sortBy", "posicion");
  const [sortOrder, setSortOrder] = useLocalStorage("sortOrder", "asc");

  // useEffect para cargar los datos
  useEffect(() => {
    fetch("/data/productos.json")
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar datos");
        return response.json();
      })
      .then((json) => {
        const validProducts = (json || []).filter((p) =>
          Array.isArray(p.variantes)
        );

        const processedData = validProducts.flatMap((producto) =>
          (producto.variantes || []).map((variante) => ({
            ...variante,
            productoId: producto.id || "",
            productoNombre: producto.nombre || "",
            productoMarca: producto.marca || "",
            productoTipo: producto.tipo || "",
            precioCaja: producto.precioCaja ?? 0,
            fabrica: producto.fabrica ?? producto.Fabrica ?? "",
            suela: producto.suela ?? variante.suela ?? "",
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

  // ========================================================
  // Funciones Helper de Filtrado y Ordenamiento
  // ========================================================

  const matches = (variantField, selectedValues) => {
    if (!selectedValues || selectedValues.length === 0) return true;
    if (variantField === undefined || variantField === null) return false;

    if (Array.isArray(variantField)) {
      return variantField.some((v) => selectedValues.includes(v));
    }
    return selectedValues.includes(String(variantField));
  };

  const matchOtros = (variante, selectedOtros) => {
    if (!selectedOtros || selectedOtros.length === 0) return true;
    return selectedOtros.some((opt) => {
      if (opt === "Con caja") return !!String(variante.precioCaja).trim();
      if (opt === "Sin caja") return !String(variante.precioSinCaja).trim();
      if (opt === "Colaboración") return !!variante.colaboracion;
      return false;
    });
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      if (sortBy === "nombre") {
        const nombreA = (
          a.productoMarca +
          " " +
          a.productoNombre
        ).toLowerCase();
        const nombreB = (
          b.productoMarca +
          " " +
          b.productoNombre
        ).toLowerCase();
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

  // ========================================================
  // Handlers de Control (incluyendo lógica de reinicio de página)
  // ========================================================

  const handleFilterChange = (newFilters) => {
    // 🚨 PASO CRÍTICO: Comprueba si los filtros realmente han cambiado.
    if (areFiltersEqual(filters, newFilters)) {
      return;
    }

    // 1. Actualiza los filtros (estado y localStorage)
    setFilters(newFilters);

    // 2. Prepara la actualización de los parámetros de búsqueda (URL)
    const newParams = new URLSearchParams(searchParams);

    // 3. Lógica Condicional de Reinicio de Página (A page=1)
    if (currentPage !== 1) {
      newParams.set("page", "1");
    } else {
      if (newParams.has("page")) {
        newParams.delete("page");
      }
    }

    // 4. Sincroniza React Router
    setSearchParams(newParams, { replace: true });
  };

  // ✅ HANDLER DE PÁGINA: SOLO ACTUALIZA LA URL (MANTIENE LA PÁGINA ACTUAL)
  const handlePageChange = useCallback(
    (page) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      setSearchParams(newParams, { replace: true });

      // Scroll al inicio de la lista
      if (productsContainerRef.current) {
        productsContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [searchParams, setSearchParams, productsContainerRef]
  );

  const handleProductsPerPageChange = (event) => {
    const newProductsPerPage = Number(event.target.value);
    
    // 1. Actualiza el estado (y localStorage)
    setProductsPerPage(newProductsPerPage);

    // 2. FUERZA EL REINICIO DE PÁGINA A 1 en la URL
    const newParams = new URLSearchParams(searchParams);

    if (currentPage !== 1) {
      newParams.set("page", "1");
    } else if (newParams.has("page")) {
      newParams.delete("page");
    }

    // 3. Actualiza la URL
    setSearchParams(newParams, { replace: true });
  };

  // ✅ HANDLER DE ORDENAMIENTO POR COLUMNA: Resetea la página a 1
  const handleSortByChange = (newSortBy) => {
    // 1. Actualiza el estado (y localStorage)
    setSortBy(newSortBy);
    setSortOrder("asc"); // Reinicia el orden a ascendente

    // 2. FUERZA EL REINICIO DE PÁGINA A 1 en la URL
    const newParams = new URLSearchParams(searchParams);
    
    if (currentPage !== 1) {
      newParams.set("page", "1");
    } else if (newParams.has("page")) {
      newParams.delete("page");
    }

    // 3. Actualiza la URL para sincronizar el estado
    setSearchParams(newParams, { replace: true });
  };

  // ✅ HANDLER DE ORDENAMIENTO ASC/DESC: Resetea la página a 1
  const handleSortOrderChange = () => {
    // 1. Calcula el nuevo orden de forma síncrona y actualiza el estado
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder); 

    // 2. FUERZA EL REINICIO DE PÁGINA A 1 en la URL
    const newParams = new URLSearchParams(searchParams);
    if (currentPage !== 1) {
      newParams.set("page", "1");
    } else if (newParams.has("page")) {
      newParams.delete("page");
    }

    // 3. Actualiza la URL
    setSearchParams(newParams, { replace: true });
  };

  // Filtrado, Ordenamiento y Paginación (Lógica principal)
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

  const totalProductsCount = sortedProducts.length;
  const totalPages = Math.ceil(totalProductsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(
    startIndex + productsPerPage - 1,
    totalProductsCount
  );
  const paginatedProducts = sortedProducts.slice(startIndex - 1, endIndex);

  // Redirección por si la página actual no existe
  if (currentPage > totalPages && totalPages > 0) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", totalPages.toString());
    setSearchParams(newParams, { replace: true });
    return null;
  }

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container contenedor-centrado">
      {/* Filtro de escritorio */}
      <div className="desktop-filter">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      <div className="products-content" ref={productsContainerRef}>
        {/* Controles superiores */}
        <ProductListControls
          startIndex={startIndex}
          endIndex={endIndex}
          totalProductsCount={totalProductsCount}
          sortBy={sortBy}
          // 🚨 IMPORTANTE: Usamos los handlers que reinician la página
          setSortBy={handleSortByChange} 
          setSortOrder={handleSortOrderChange}
          sortOrder={sortOrder}
          viewType={viewType}
          setViewType={setViewType}
          setShowMobileFilter={setShowMobileFilter}
        />

        {/* Renderizado de productos */}
        <Section products={paginatedProducts} viewType={viewType} />

        {/* Controles inferiores / Paginación */}
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

      {/* Overlay de filtro móvil */}
      <MobileFilterOverlay
        showMobileFilter={showMobileFilter}
        setShowMobileFilter={setShowMobileFilter}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default ProductList;