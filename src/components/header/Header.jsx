import React, { useState } from "react";
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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isSearchBoxOpen) setIsSearchBoxOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleSearchBox = () => {
    setIsSearchBoxOpen((prev) => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="main-header">
      <nav className="header-nav">
        <div className="header-container">
          {/* Botón hamburguesa */}
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

          {/* Logo */}
          <div className="header-logo">
            <Link to="/">
              <img src={Carpincho} alt="Inicio" />
            </Link>
          </div>

          {/* Iconos */}
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

        {/* Searchbox desplegable para móvil */}
        <div className={`mobile-search-box ${isSearchBoxOpen ? "open" : ""}`}>
          <input type="text" placeholder="Buscar..." />
          <button
            className="close-search-button"
            onClick={toggleSearchBox}
            aria-label="Cerrar búsqueda"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menú principal de navegación */}
        <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          <li className={`nav-item dropdown ${isDropdownOpen ? "open" : ""}`}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Categorías <ChevronDown size={16} />
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/urbanas">
                  Urbanas
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/deportivas">
                  Deportivas
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/basquet">
                  Basquet
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/futbol">
                  Futbol
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/mujer">
              Mujer
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/hombre">
              Hombre
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/marcas">
              Marcas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/zapatillas">
              Zapatillas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-liquidacion" to="/liquidacion">
              🔥 Liquidación
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
