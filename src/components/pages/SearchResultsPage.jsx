// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Section from "../section/Section"; // Asegúrate de que la ruta sea correcta
import Loader from "../common/Loader"; // Ajusta la ruta si es necesario
import NotFound from "../common/NotFound"; // Componente para mostrar cuando no hay resultados
import productosData from "../../../public/data/productos.json"; // ✅ Importación directa de tu JSON

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const searchQuery = query.get("q");

  useEffect(() => {
    setLoading(true);
    if (searchQuery) {
      const filtered = productosData.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tipo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
    setLoading(false);
  }, [searchQuery]);

  if (loading) {
    return <Loader />;
  }

  if (searchResults.length === 0) {
    return <NotFound message="No se encontraron resultados para tu búsqueda." />;
  }

  return (
    <div className="search-results-page">
      <Section title={`Resultados de búsqueda para "${searchQuery}"`} products={searchResults} />
    </div>
  );
};

export default SearchResultsPage;