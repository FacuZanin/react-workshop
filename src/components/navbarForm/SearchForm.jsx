import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SearchForm.css';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="search-form">
      <div className="search-input">
        <input
          className="form-control search-field"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="reset-button"
            aria-label="Limpiar búsqueda"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <button type="submit" className="search-button" aria-label="Buscar">
        <FaSearch className="search-icon" />
      </button>
    </form>
  );
};

export default SearchForm;
