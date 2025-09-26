// src/pages/SearchResultsPage.jsx

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Section from "../section/Section"; 
import Loader from "../common/Loader"; 
import NotFound from "../common/NotFound";
import Pagination from "../section/Pagination"; 
import productosData from "../../../public/data/productos.json";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react"; 
import "./SearchResultsPage.css"; 

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const normalizeProductData = (products) => {
  if (!products || !Array.isArray(products)) return [];

  return products.flatMap((product) =>
    (product.variantes || []).map((variant) => ({
      ...variant,
      productoId: product.id,
      productoNombre: product.nombre,
      productoMarca: product.marca,
      productoTipo: product.tipo,
      precioCaja: product.precioCaja,
      precioSinCaja: product.precioSinCaja,

      productoFabrica: product.fabrica,
      productoOrigen: product.origen,
      esColaboracion: !!product.colaboracion,
      colaboracionSearchTag: product.colaboracion ? "colaboracion si" : "colaboracion no", 
      tallesDisponibles: (variant.talles || []).join(" "), 
      precioTipoEtiqueta: product.precioCaja > 0 ? "con caja" : "sin caja",
      
      // 🟢 Nuevo: Precio unificado para el ordenamiento
      precioDisplay: product.precioCaja > 0 ? product.precioCaja : product.precioSinCaja, 
    }))
  ).filter(variant => variant.productoId);
};

/**
 * Lógica de Ordenamiento reutilizable
 */
const sortProducts = (products, sortBy, sortOrder) => {
  if (products.length === 0) return products;

  const sorted = [...products].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'nombre':
        aValue = a.productoNombre || '';
        bValue = b.productoNombre || '';
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      case 'precio':
        aValue = a.precioDisplay || 0; 
        bValue = b.precioDisplay || 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      case 'posicion':
      default:
        return 0; 
    }
  });
  return sorted;
};

// ==============================================
// 🎯 COMPONENT
// ==============================================

const SearchResultsPage = () => {
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const searchQuery = query.get("query");
  
  // 🟢 ESTADOS PARA CONTROL (Ordenamiento, Paginación y Vista)
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(24);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("posicion");
  const [sortOrder, setSortOrder] = useState("asc");
  const resultsRef = useRef(null); // Para scroll al cambiar de página

  // Normalización inicial de la data (solo una vez)
  const normalizedData = useMemo(() => normalizeProductData(productosData), []);

  // 1. 🟢 PROCESAMIENTO PRINCIPAL: Búsqueda y Ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    setLoading(true);
    if (!searchQuery) {
      setLoading(false);
      return [];
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    
    // 1.1 Filtrado (Lógica flexible de búsqueda de la última corrección)
    let filtered = normalizedData.filter((variant) => {
      const isMatch = (field) => field?.toLowerCase().includes(lowerCaseQuery);

      const nombreMatch = isMatch(variant.productoNombre);
      const marcaMatch = isMatch(variant.productoMarca);
      const tipoMatch = isMatch(variant.productoTipo);
      const fabricaMatch = isMatch(variant.productoFabrica);
      const origenMatch = isMatch(variant.productoOrigen);
      const precioTipoMatch = isMatch(variant.precioTipoEtiqueta);
      const colorMatch = variant.color?.some(c => c.toLowerCase().includes(lowerCaseQuery));
      const tallesMatch = isMatch(variant.tallesDisponibles);
      
      let colaboracionFilterMatch = false;
      if (isMatch("colaboracion") || lowerCaseQuery === 'si') {
          colaboracionFilterMatch = variant.esColaboracion;
      } else if (lowerCaseQuery.includes('no')) {
          colaboracionFilterMatch = !variant.esColaboracion;
      }

      return (
        nombreMatch ||
        marcaMatch ||
        tipoMatch ||
        fabricaMatch ||
        origenMatch ||
        precioTipoMatch ||
        colorMatch ||
        tallesMatch ||
        colaboracionFilterMatch
      );
    });
    
    // 1.2 Ordenamiento
    const sorted = sortProducts(filtered, sortBy, sortOrder);

    setLoading(false);
    return sorted;
  }, [searchQuery, normalizedData, sortBy, sortOrder]);

  // 2. Lógica de Paginación
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Productos que se muestran en la página actual
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // 3. Handlers para los controles
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // 🟢 Scroll al inicio de los resultados al cambiar de página
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset a la primera página
  };
  
  const handleProductsPerPageChange = (e) => {
    const newProductsPerPage = Number(e.target.value);
    setProductsPerPage(newProductsPerPage);
    setCurrentPage(1); // Reset a la primera página
  };

  // 4. Resetear la página al cambiar la búsqueda
  useEffect(() => {
      setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return <Loader />;
  }

  if (!searchQuery || filteredAndSortedProducts.length === 0) {
    return <NotFound message={`No se encontraron resultados para "${searchQuery || 'tu búsqueda'}"`} />;
  }

  // ==============================================
  // 🎯 RENDERING (Integración de Controles y Section)
  // ==============================================
  return (
    // 🟢 Contenedor principal para centrar y limitar ancho
    <div className="main-container"> 
      <div className="products-content" ref={resultsRef}>
        
        {/* 🟢 TOP SECTION INFO (Resultados y Controles Superiores) */}
        <div className="top-section-info">
          
          {/* Conteo de Resultados */}
          <p className="results-count">
            {totalProducts} PRODUCTOS ENCONTRADOS PARA "{searchQuery.toUpperCase()}"
          </p>

          {/* Controles de Vista y Ordenamiento */}
          <div className="products-controls">
            
            {/* Controles de Vista (Grid/List) */}
            <div className="products-view-controls">
              <button
                className={`view-btn ${viewType === "grid" ? "active" : ""}`}
                onClick={() => setViewType("grid")}
                aria-label="Vista de cuadrícula"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                className={`view-btn ${viewType === "list" ? "active" : ""}`}
                onClick={() => setViewType("list")}
                aria-label="Vista de lista"
              >
                <List size={20} />
              </button>
            </div>

            {/* Controles de Ordenamiento */}
            <div className="products-sort-controls">
              <ArrowUpDown size={20} />
              <select value={`${sortBy}-${sortOrder}`} onChange={handleSortChange}>
                <option value="posicion-asc">Posición</option>
                <option value="nombre-asc">Nombre (A-Z)</option>
                <option value="nombre-desc">Nombre (Z-A)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* 🟢 SECCIÓN DE PRODUCTOS (Usa el array paginado) */}
        {/* Usamos el título del Section original de SearchResultsPage */}
        <Section title={null} products={currentProducts} viewType={viewType} />

        {/* 🟢 PAGINACIÓN Y CONTROLES INFERIORES */}
        {totalProducts > 0 && (
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
    </div>
  );
};

export default SearchResultsPage;