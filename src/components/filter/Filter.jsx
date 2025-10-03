// src/components/filter/Filter.jsx (Asegurando la inyección de la lógica de filtros)

import { useState, useEffect, useMemo } from "react";
import "./Filter.css";
import { ChevronDown, X } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage"; // Asegúrate de que la ruta sea correcta

// Definición de las categorías (ESTO DEBE QUEDAR DENTRO DEL COMPONENTE)
const filterCategories = [
  { title: "Color", key: "color", options: ["Animal Print","Amarillo","Azul","Beige","Blanco","Bordo","Celeste","Dorado","Fucsia","Gris","Marrón","Naranja","Negro","Rojo","Rosa","Verde","Violeta","Varios"] },
  { title: "Marca", key: "marca", options: ["Adidas","Asics","Boss","CAT","Converse","Fila","Lacoste","Mizuno","New Balance","Nike","Olympikus","Puma","Tommy Hilfiger","Veja","Vans"] },
  { title: "Tipo de producto", key: "tipo", options: ["Borcego","Botines","Botita","Crocs","Infantil","Ojota","Sandalia","Zapato","Zapatilla"] },
  { title: "Fábrica", key: "fabrica", options: ["Bob","Milton","Nacional","Lali","Zilmar"] },
  { title: "Origen", key: "origen", options: ["Brasil","China","Argentina"] },
  { title: "Suela", key: "suela", options: ["Caucho TR","EVA","Microexpandido","PVC","Vulcanizado"] },
  { title: "Talles", key: "talle", options: ["21 - 26","27 - 34","35 - 40","39 - 44","45 +"] },
  { title: "Otros", key: "otros", options: ["Colaboración", "Suela Antideslizante"] },
];


// 📢 Recibimos 'onFilterChange' para comunicar los filtros seleccionados
const Filter = ({ 
  totalProductsCount, // Para mostrar el conteo
  onFilterChange // Función que SearchResultsPage usará para filtrar
}) => {
  // Inicializamos el estado de los filtros desde localStorage
  const [selectedFilters, setSelectedFilters] = useLocalStorage("searchFilters", {});
  const [openIndex, setOpenIndex] = useState(null);

  // 1. Efecto para notificar a SearchResultsPage cada vez que los filtros cambien
  useEffect(() => {
    // onFilterChange debe ser llamado con los filtros actuales
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);


  // 2. Manejadores de Interacción
  const toggleCategory = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCheckboxChange = (categoryKey, option) => {
    setSelectedFilters((prevFilters) => {
      const currentOptions = prevFilters[categoryKey] || [];
      const isSelected = currentOptions.includes(option);

      const newOptions = isSelected
        ? currentOptions.filter((item) => item !== option) // Quitar
        : [...currentOptions, option]; // Agregar

      if (newOptions.length === 0) {
        // Eliminar la categoría si no hay opciones seleccionadas
        const { [categoryKey]: _, ...rest } = prevFilters;
        return rest;
      }

      return {
        ...prevFilters,
        [categoryKey]: newOptions,
      };
    });
  };

  const handleRemoveActiveFilter = (categoryKey, option) => {
    handleCheckboxChange(categoryKey, option); // Reutilizamos la lógica
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
  };


  // 3. Renderizado de Filtros Activos
  const activeFilters = useMemo(() => {
    return Object.entries(selectedFilters).filter(([_, options]) => options.length > 0);
  }, [selectedFilters]);


  return (
    <div className="sidebar-filter">
      <h3 className="filter-title">Filtros</h3>

      {/* Sección de Filtros Activos */}
      {activeFilters.length > 0 && (
        <div className="active-filters-container">
          <div className="active-filters-header">
            <span>Filtros Activos ({activeFilters.length})</span>
            <button onClick={handleClearAllFilters} className="clear-all-btn">
              LIMPIAR
            </button>
          </div>
          <div className="active-filters-list">
            {activeFilters.map(([category, options]) =>
              options.map((option) => (
                <span key={`${category}-${option}`} className="active-filter-tag">
                  {option}
                  <button className="remove-filter-btn" onClick={() => handleRemoveActiveFilter(category, option)}>
                    <X size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Acordeones de Categorías */}
      <div className="accordions">
        {filterCategories.map((category, index) => (
          <div key={index} className={`accordion-item ${openIndex === index ? "open" : ""}`}>
            <div className="accordion-header" onClick={() => toggleCategory(index)}>
              {category.title}
              <span className={`arrow ${openIndex === index ? "rotate" : ""}`}>
                <ChevronDown size={18} strokeWidth={3} color="white" />
              </span>
            </div>

            <div className="accordion-body">
              <ul className="filter-options">
                {category.options.map((option, i) => (
                  <li key={i}>
                    <label>
                      {option}
                      <input
                        type="checkbox"
                        checked={selectedFilters[category.key]?.includes(option) || false}
                        onChange={() => handleCheckboxChange(category.key, option)}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;