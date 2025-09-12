import React, { useState, useEffect } from "react";
import Section from "./Section";
import Loader from "../common/Loader";
import Filter from "../filter/Filter";
import "./mycomponent.css";
import { Funnel, X } from "lucide-react";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar datos");
        return response.json();
      })
      .then((json) => {
        setData(json);
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
  };

  const filteredProducts = data
    .map((producto) => {
      // ✅ Solución al error: Garantiza que se usa un array vacío si `variantes` es nulo o indefinido
      const variantesFiltradas = (producto.variantes || []).filter((v) => {
        return Object.entries(filters).every(([key, values]) => {
          if (!values.length) return true;

          if (key === "talles") {
            return v.talles?.some((t) => values.includes(t.trim()));
          }

          if (key === "color") {
            return v.color?.some((c) => {
              if (c.trim() === "Varios") {
                return values.includes("Varios");
              }
              return values.includes(c.trim());
            });
          }

          if (key === "caja") {
            if (values.includes("Con caja")) return producto.precioCaja > 0;
            if (values.includes("Sin caja")) return producto.precioSinCaja > 0;
          }

          if (key === "colaboracion") {
            if (values.includes("Colaboración"))
              return producto.colaboracion === true;
          }

          return values.includes(producto[key]);
        });
      });

      if (variantesFiltradas.length > 0) {
        return { ...producto, variantes: variantesFiltradas };
      }
      return null;
    })
    .filter(Boolean);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container">
      {/* Desktop Filter: visible en pantallas más grandes */}
      <div className="desktop-filter">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      <div className="products-content">
        {/* Mobile Filter Button: visible en móviles */}
        <div className="mobile-filter-btn-container">
          <button
            className="mobile-filter-btn"
            onClick={() => setShowMobileFilter(true)}
          >
            <Funnel size={18} fill="#00719B" color="#00719B" />
            <span>REFINÁ TU BÚSQUEDA</span>
          </button>
        </div>
        <Section products={filteredProducts} />
      </div>

      {/* Mobile Filter Overlay */}
      <div
        className={`mobile-filter-overlay ${showMobileFilter ? "open" : ""}`}
        onClick={() => setShowMobileFilter(false)}
      >
        {/* Botón de cerrar "X" - Se muestra sobre el fondo transparente */}
        <button
          className="mobile-filter-close-btn"
          onClick={() => setShowMobileFilter(false)}
        >
          <X size={24} />
        </button>

        {/* Contenedor del panel de filtros (el recuadro blanco que se desliza) */}
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