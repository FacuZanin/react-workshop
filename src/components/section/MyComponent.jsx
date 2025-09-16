import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import Loader from "../common/Loader";
import Filter from "../filter/Filter";
import "./mycomponent.css";
import { Funnel, X } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage"; // ✅ Importa el hook

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const productsContainerRef = useRef(null);
  
  // ✅ Usa useLocalStorage para persistir los filtros en MyComponent
  const [filters, setFilters] = useLocalStorage("filters", {});

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

  const filteredProducts = data.flatMap((producto) => {
    const variantesFiltradas = (producto.variantes || []).filter((v) => {
      return Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;

        switch (key) {
          case "color":
            return v.color?.some((c) => values.includes(c));
          case "talles":
            return v.talles?.some((t) => values.includes(t.trim()));
          case "caja":
            if (values.includes("Con caja")) return producto.precioCaja > 0;
            if (values.includes("Sin caja")) return producto.precioSinCaja > 0;
            return false;
          case "colaboracion":
            if (values.includes("Colaboración")) return producto.colaboracion === true;
            return false;
          case "fabrica":
            return values.includes(producto.fabrica);
          case "origen":
            return values.includes(producto.origen);
          case "suela":
            return values.includes(producto.suela);
          default:
            return values.includes(producto[key]);
        }
      });
    });

    if (variantesFiltradas.length > 0) {
      return { ...producto, variantes: variantesFiltradas };
    }
    return [];
  });

  useEffect(() => {
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [filteredProducts]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container">
      <div className="desktop-filter">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      <div className="products-content" ref={productsContainerRef}>
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