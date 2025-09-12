import { useState } from "react";
import "./Filter.css";
import { ChevronDown } from "lucide-react";

const filterCategories = [
  {
    title: "Color",
    key: "color",
    options: [
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
    title: "Origen",
    key: "origen",
    options: ["Argentina", "Brasil", "China"],
  },
  {
    title: "Talles",
    key: "talles",
    options: ["21 - 26", "27 - 34", "35 - 40", "39 - 44", "45 +"],
  },
  {
    title: "Fábrica",
    key: "fabrica",
    options: ["JR", "BOB", "MD", "Milla", "Maycon", "Di Fabrica"],
  },
  {
    title: "Tipo de suela",
    key: "suela",
    options: ["Caucho TR", "EVA", "Microexpandido", "PVC", "Vulcanizado"],
  },
  {
    title: "Caja",
    key: "caja",
    options: ["Con caja", "Sin caja"],
  },
  {
    title: "Colaboración",
    key: "colaboracion",
    options: ["Colaboración"],
  },
];

function Filter({ onFilterChange }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleCategory = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCheckboxChange = (categoryKey, option) => {
    setSelectedFilters((prev) => {
      const prevOptions = prev[categoryKey] || [];
      const newOptions = prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option];

      const newFilters = { ...prev, [categoryKey]: newOptions };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="sidebar-filter">
      <h3 className="filter-title">REFINÁ TU BÚSQUEDA</h3>
      <div className="accordions">
        {filterCategories.map((category, index) => (
          <div
            key={index}
            className={`accordion-item ${openIndex === index ? "open" : ""}`}
          >
            <div className="accordion-header" onClick={() => toggleCategory(index)}>
              {category.title}
              <span className={`arrow ${openIndex === index ? "rotate" : ""}`}>
                <ChevronDown size={18} strokeWidth={3} color="#111" />
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