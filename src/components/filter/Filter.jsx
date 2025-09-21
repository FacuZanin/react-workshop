import { useState } from "react";
import "./Filter.css";
import { ChevronDown, X } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const filterCategories = [
  {
    title: "Color",
    key: "color",
    options: [
      "Animal Print",
      "Amarillo",
      "Azul",
      "Beige",
      "Blanco",
      "Bordo",
      "Celeste",
      "Dorado",
      "Fucsia",
      "Gris",
      "Marrón",
      "Naranja",
      "Negro",
      "Rojo",
      "Rosa",
      "Verde",
      "Violeta",
      "Varios",
    ],
  },
  {
    title: "Marca",
    key: "marca",
    options: [
      "Adidas",
      "Asics",
      "Boss",
      "CAT",
      "Converse",
      "Fila",
      "Lacoste",
      "Mizuno",
      "New Balance",
      "Nike",
      "Olympikus",
      "Puma",
      "Tommy Hilfiger",
      "Veja",
      "Vans",
    ],
  },
  {
    title: "Tipo de producto",
    key: "tipo",
    options: [
      "Borcego",
      "Botines",
      "Botita",
      "Crocs",
      "Infantil",
      "Ojota",
      "Sandalia",
      "Zapato",
      "Zapatilla",
    ],
  },
  {
    title: "Fábrica",
    key: "fabrica",
    options: ["Bob", "Bobitos", "Nacional", "Lali", "Ceci"],
  },
  {
    title: "Origen",
    key: "origen",
    options: ["Brasil", "China", "Argentina"],
  },
  {
    title: "Suela",
    key: "suela",
    options: ["Caucho TR", "EVA", "Microexpandido", "PVC", "Vulcanizado"],
  },
  {
    title: "Talles",
    key: "talles",
    options: ["21 - 26", "27 - 34", "35 - 40", "39 - 44", "45 +"],
  },
  {
    title: "Otros",
    key: "otros",
    options: ["Con caja", "Sin caja", "Colaboración"],
  },
];

function Filter({ onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useLocalStorage("filters", {}); // ✅ Esta línea está ahora correctamente implementada.
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCategory = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCheckboxChange = (categoryKey, option) => {
    const newFilters = { ...selectedFilters };

    if (!newFilters[categoryKey]) {
      newFilters[categoryKey] = [];
    }

    if (newFilters[categoryKey].includes(option)) {
      newFilters[categoryKey] = newFilters[categoryKey].filter(
        (item) => item !== option
      );
    } else {
      newFilters[categoryKey].push(option);
    }

    if (newFilters[categoryKey].length === 0) {
      delete newFilters[categoryKey];
    }

    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRemoveActiveFilter = (categoryKey, option) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[categoryKey]) {
      newFilters[categoryKey] = newFilters[categoryKey].filter(
        (item) => item !== option
      );
      if (newFilters[categoryKey].length === 0) {
        delete newFilters[categoryKey];
      }
      setSelectedFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="sidebar-filter">
      <h3 className="filter-title">REFINÁ TU BÚSQUEDA</h3>
      
      {Object.keys(selectedFilters).length > 0 && (
        <div className="active-filters">
          <h4>Filtros Activos</h4>
          <div className="active-filters-container">
            {Object.entries(selectedFilters).map(([category, options]) =>
              options.map((option) => (
                <span key={option} className="filter-tag">
                  {option}
                  <button
                    className="remove-filter-btn"
                    onClick={() => handleRemoveActiveFilter(category, option)}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <div className="accordions">
        {filterCategories.map((category, index) => (
          <div
            key={index}
            className={`accordion-item ${openIndex === index ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleCategory(index)}
            >
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
                        checked={
                          selectedFilters[category.key]?.includes(option) ||
                          false
                        }
                        onChange={() =>
                          handleCheckboxChange(category.key, option)
                        }
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