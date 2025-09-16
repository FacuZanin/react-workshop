import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      navigate(`/search?q=${searchQuery}`);
      toggleSearchBox();
    }
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
            <img src={Carpincho} alt="Logo Carpincho" />
          </Link>
          
          <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>

            {/* ✅ Enlaces fijos agregados aquí */}
            <li className="nav-item">
              <Link to="/zapatillas" className="nav-link" onClick={toggleMenu}>
                Calzado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/fardos" className="nav-link" onClick={toggleMenu}>
                Fardos
              </Link>
            </li>
          </ul>

          <div className="header-icons">
            <button
              className="mobile-search-toggle"
              onClick={toggleSearchBox}
              aria-label="Abrir buscador"
            >
              <Search size={22} />
            </button>
            <Link to="/acceso" aria-label="Acceder" className="icon-link">
              <User size={22} />
            </Link>
            <Link to="/favoritos" aria-label="Favoritos" className="icon-link">
              <Heart size={22} />
            </Link>
            <Link to="/carrito" aria-label="Carrito" className="icon-link">
              <ShoppingCart size={22} />
            </Link>
            
            <form className={`mobile-search-box ${isSearchBoxOpen ? "open" : ""}`} onSubmit={handleSearch}>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="search-submit-button"
                  aria-label="Buscar"
                >
                  <Search size={24} />
                </button>
                <button
                  type="button"
                  className="close-search-button"
                  onClick={toggleSearchBox}
                  aria-label="Cerrar búsqueda"
                >
                  <X size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;