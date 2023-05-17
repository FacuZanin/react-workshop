import React from "react";
import Navbar from "./components/Navbar";
import ItemListContainer from "./components/ItemListContainer";
import Navbigator from "./components/Navbigator"
import 'bootstrap/dist/css/bootstrap.min.css';
import MyCarousel from "./components/MyCarousel";

function App() {
  return (
    <div className="container-fluid">
      <header className="row">
        <div className="col">
          {/* Contenido del encabezado */}
        </div>
      </header>
      <nav className="row">
        <div className="col">
          {/* Contenido de la barra de navegación */}
          <Navbar />
          <Navbigator/>
          <MyCarousel/>
        </div>
      </nav>
      <main className="row">
        <div className="col-md-9">
          {/* Contenido principal */}
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
          <ItemListContainer greeting="Alta Gama!" />
        </div>
        <div className="col-md-3">
          {/* Contenido secundario */}
        </div>
      </main>
      <footer className="row">
        <div className="col">
          {/* Contenido del pie de página */}
        </div>
      </footer>
    </div>
  );
}

export default App;
