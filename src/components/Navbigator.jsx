import React from 'react';
import Switch from './Switch';
import './Navbigator.css';

const Navbigator = () => {
  return (
    <div className='sticky-top'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light ">
        <div className="container">
          <div className="d-flex justify-content-center w-100">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">Categorías</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Mujer</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Hombre</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Marcas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Zapatillas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Liquidación</a>
              </li>
            </ul>
          </div>
          <div className="ml-auto pr-0">
            <Switch />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbigator;
