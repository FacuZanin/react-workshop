import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Search,
  Heart,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Carpincho from "../../assets/images/carpincho.png";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Cargar productos una vez cuando el componente se monta
  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // Filtrar productos cada vez que cambia el texto de búsqueda
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = allProducts.filter(
        (product) =>
          product.nombre
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tipo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isSearchBoxOpen) setIsSearchBoxOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleSearchBox = () => {
    setIsSearchBoxOpen((prev) => !prev);
    if (isSearchBoxOpen) {
      setSearchQuery("");
    }
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // ✅ Función para manejar el clic en los resultados y evitar la pantalla en blanco
  const handleResultClick = () => {
    // Se añade un pequeño retraso para permitir que la navegación se complete
    setTimeout(() => {
      toggleSearchBox();
    }, 100);
  };

  return (
    <header className="main-header">
      <nav className="header-nav">
        <div className="header-container">
          <button
            className={`nav-toggle ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <Link to="/" className="header-logo">
            <img src={Carpincho} alt="Carpincho Sneakers Logo" />
          </Link>

          {/* ✅ Se elimina el buscador de escritorio */}
          {/* <div className="desktop-search">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}

          <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item dropdown" onClick={toggleDropdown}>
              <span className="nav-link">
                Productos
                <ChevronDown
                  size={16}
                  className={`dropdown-arrow ${
                    isDropdownOpen ? "rotate" : ""
                  }`}
                />
              </span>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/zapatillas">Zapatillas</Link>
                  </li>
                  <li>
                    <Link to="/fardos">Fardos</Link>
                  </li>
                </ul>
              )}
            </li>
            {/* ✅ Se eliminan los nav-items adicionales para mantener solo los que necesitas */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/zapatillas">
                Zapatillas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fardos">
                Fardos
              </Link>
            </li> */}
          </ul>

          <div className="header-icons">
            <button
              className="mobile-search-toggle"
              onClick={toggleSearchBox}
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            <Link
              to="/perfil"
              aria-label="Perfil de usuario"
              className="icon-link"
            >
              <User size={22} />
            </Link>
            <Link to="/favoritos" aria-label="Favoritos" className="icon-link">
              <Heart size={22} />
            </Link>
            <Link to="/carrito" aria-label="Carrito" className="icon-link">
              <ShoppingCart size={22} />
            </Link>
          </div>
        </div>

        {/* Searchbox desplegable para móvil y resultados */}
        <div className={`mobile-search-box ${isSearchBoxOpen ? "open" : ""}`}>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="close-search-button"
              onClick={toggleSearchBox}
              aria-label="Cerrar búsqueda"
            >
              <X size={24} />
            </button>
          </div>
          {searchQuery && searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/producto/${product.id}`}
                    onClick={handleResultClick} // ✅ Uso de la nueva función
                  >
                    {product.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;