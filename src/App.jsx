import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import MyCarousel from "./components/carousel/MyCarousel";
import Footer from "./components/footer/Footer";
import MyComponent from "./components/section/MyComponent";
import FavoritosPage from "./components/pages/FavoritosPage";
import CarritoPage from "./components/pages/CarritoPage";
import { CarritoProvider } from "./components/pages/CarritoContext";

function App() {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => setProductsData(data))
      .catch((err) => console.error("Error cargando productos.json:", err));
  }, []);

  return (
    <CarritoProvider>
      {/* Nuevo contenedor principal sin clases de Bootstrap */}
      <div className="main-app-container">
        <header>
          <Header />
          <MyCarousel />
        </header>

        {/* ✅ Nuevo: Contenedor principal para la sección de productos y el filtro */}
        <main className="main-layout-grid">
          <Routes>
            <Route path="/" element={<MyComponent />} />
            <Route
              path="/favoritos"
              element={<FavoritosPage products={productsData} />}
            />
            <Route
              path="/carrito"
              element={<CarritoPage />}
            />
          </Routes>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </CarritoProvider>
  );
}

export default App;