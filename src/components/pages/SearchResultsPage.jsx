// src/pages/SearchResultsPage.jsx

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Section from "../section/Section"; 
import Loader from "../common/Loader"; 
import NotFound from "../common/NotFound";
import Pagination from "../section/Pagination"; 
import Filter from "../filter/Filter"; // 🟢 Nuevo: Componente de filtro
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
      
      // 🟢 Nuevo: Añadimos 'suela' a la data normalizada para el filtro
      productoSuela: product.suela || '',

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
// 🎯 LÓGICA DE FILTRADO AVANZADA (nueva)
// ==============================================

/**
 * Mapea la clave del filtro a la propiedad del producto y aplica la lógica de filtrado.
 */
const applyCategoryFilter = (product, categoryKey, selectedValues) => {
    const productPropMap = {
        'color': 'color', 
        'marca': 'productoMarca',
        'tipo': 'productoTipo',
        'fabrica': 'productoFabrica',
        'origen': 'productoOrigen',
        'suela': 'productoSuela', // Usamos la nueva propiedad
    };
    const productKey = productPropMap[categoryKey];

    // Lógica especial para Talles (filtrado por rangos)
    if (categoryKey === 'talle') {
        const productTalles = (product.tallesDisponibles || '').split(' ').map(t => parseInt(t, 10)).filter(n => !isNaN(n));
        
        if (productTalles.length === 0) return false; 
        
        return selectedValues.some(rangeString => {
            const match = rangeString.match(/(\d+)\s*-\s*(\d+)/); // Rango: "35 - 40"
            const matchPlus = rangeString.match(/(\d+)\s*\+/); // Rango: "45 +"

            let minTalle = -Infinity;
            let maxTalle = Infinity;

            if (match) {
                minTalle = parseInt(match[1], 10);
                maxTalle = parseInt(match[2], 10);
            } else if (matchPlus) {
                minTalle = parseInt(matchPlus[1], 10);
                // maxTalle ya es Infinity
            } else {
                return false; 
            }

            return productTalles.some(talleNum => talleNum >= minTalle && talleNum <= maxTalle);
        });
    }

    // Filtro de Colaboración (lógica booleana)
    if (categoryKey === 'otros' && selectedValues.includes('Colaboración')) {
        return product.esColaboracion;
    }

    if (!productKey) return true; // Si la clave no está mapeada, el producto pasa.

    const productValue = product[productKey];

    // Lógica para campos que son arrays (e.g., 'color')
    if (Array.isArray(productValue)) {
        // Pasa si AL MENOS UN valor del producto coincide con CUALQUIER valor seleccionado (OR)
        return productValue.some(val => selectedValues.includes(val));
    }

    // Lógica para campos que son strings (e.g., 'marca', 'tipo', 'fabrica')
    if (typeof productValue === 'string') {
        // Pasa si el valor del producto coincide con CUALQUIERA de los valores seleccionados (OR)
        return selectedValues.includes(productValue);
    }

    return true;
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
  // 🟢 Nuevo: Estado para manejar los filtros de categoría
  const [selectedFilters, setSelectedFilters] = useState({}); 
  const resultsRef = useRef(null); // Para scroll al cambiar de página

  // Normalización inicial de la data (solo una vez)
  const normalizedData = useMemo(() => normalizeProductData(productosData), []);

  // 1. 🟢 PROCESAMIENTO PRINCIPAL: Búsqueda, Filtrado y Ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    setLoading(true);
    setCurrentPage(1); // Reset a la primera página al cambiar la búsqueda o el filtro
    
    // Si no hay consulta de búsqueda, mostramos un resultado vacío y terminamos
    if (!searchQuery) {
      setLoading(false);
      return [];
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    
    // 1.1 Filtrado por Búsqueda (Texto)
    let filtered = normalizedData.filter((variant) => {
      const isMatch = (field) => field?.toLowerCase().includes(lowerCaseQuery);

      const nombreMatch = isMatch(variant.productoNombre);
      const marcaMatch = isMatch(variant.productoMarca);
      const tipoMatch = isMatch(variant.productoTipo);
      const fabricaMatch = isMatch(variant.productoFabrica);
      const origenMatch = isMatch(variant.productoOrigen);
      const suelaMatch = isMatch(variant.productoSuela); // Nueva propiedad
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
        suelaMatch || // Nuevo: Búsqueda por suela
        precioTipoMatch ||
        colorMatch ||
        tallesMatch ||
        colaboracionFilterMatch
      );
    });
    
    // 1.2 🟢 Filtrado por Categoría (Filtro lateral)
    const activeFilterCategories = Object.keys(selectedFilters).filter(
        (key) => selectedFilters[key]?.length > 0
    );

    if (activeFilterCategories.length > 0) {
        filtered = filtered.filter((product) => {
            // Un producto debe pasar el filtro de *TODAS* las categorías activas (AND lógica)
            return activeFilterCategories.every((categoryKey) => {
                const selectedValues = selectedFilters[categoryKey];
                return applyCategoryFilter(product, categoryKey, selectedValues);
            });
        });
    }

    // 1.3 Ordenamiento
    const sorted = sortProducts(filtered, sortBy, sortOrder);

    setLoading(false);
    return sorted;
  }, [searchQuery, normalizedData, sortBy, sortOrder, selectedFilters]); // 🟢 Dependencia de selectedFilters

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

  // 🟢 Nuevo: Handler para el componente Filter
  const handleFilterChange = useCallback((newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1); // Reset a la primera página con cada cambio de filtro
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

  // 4. Resetear la página al cambiar la búsqueda (aunque ya lo hace el useMemo, lo mantenemos por si acaso)
  useEffect(() => {
      setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return <Loader />;
  }

  if (!searchQuery || filteredAndSortedProducts.length === 0) {
    // Si hay filtros seleccionados, el mensaje es diferente
    const filterMessage = Object.values(selectedFilters).some(v => v.length > 0) 
        ? "No se encontraron resultados que coincidan con los filtros y la búsqueda." 
        : `No se encontraron resultados para "${searchQuery || 'tu búsqueda'}"`;

    return <NotFound message={filterMessage} />;
  }

  // ==============================================
  // 🎯 RENDERING (Integración de Controles y Section)
  // ==============================================
  return (
    // 🟢 Contenedor principal para centrar y limitar ancho
    <div className="main-container"> 
      {/* 🟢 Nuevo: Contenedor para el layout de barra lateral y contenido */}
      <div className="products-layout-with-filter">
        
        {/* 1. FILTRO LATERAL */}
        <Filter
            products={normalizedData}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
        />

        {/* 2. CONTENIDO PRINCIPAL (donde van los resultados) */}
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
    </div>
  );
};

export default SearchResultsPage;