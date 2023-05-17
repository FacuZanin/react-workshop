import React from 'react';
import './Navbar.css';
import SearchForm from './SearchForm';
import FaUser from './Icons/UserWidget';
import CartWidget from './Icons/CartWidget';
import HeartWidget from './Icons/HeartWidget';
import Corona from './images/Corona.jpeg';

const Navbar = () => {
  return (
    <header className="">
      {/* Barra ancha de navegacion */}
      <nav className="navbar navbar-expand-lg navbar-light bg-black">
        <div className="container-fluid">
          <div className='col-4'>
            <img src={Corona} alt='Inicio' height={100} width={100}/>
          </div>
          <div className='container col-4'>
            <SearchForm/>
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
    </header>
  );
};

export default Navbar;
