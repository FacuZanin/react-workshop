import React from 'react';
import './Navbar.css';
import FaUser from './Icons/UserWidget';
import CartWidget from './Icons/CartWidget';
import HeartWidget from './Icons/HeartWidget';
import Corona from './images/Corona.jpeg'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-black fixed-top ">
      <div className="container-fluid w-100" id=''>
        <div className='col-4'>
        <img src={Corona} alt='Inicio' height={100} width={100}/>
        </div>
        <div className='container col-4'>
        <input class="form-control me-2" type="search" placeholder="Ingresar" aria-label="Search" id="cuadroBotonBuscar"></input>
        </div>
        <div className="col-4" id="">
          <div className="navbar-icons">
            <a href=''>
              <FaUser />
            </a>
            <a href=''>
              <HeartWidget />
            </a>
            <a href=''>
              <CartWidget />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
