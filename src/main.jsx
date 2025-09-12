// Librerías externas
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Estilos globales
import './index.css';

// Componentes locales
import App from './App.jsx';
import ProductDetail from './components/pages/ProductDetail.jsx';
import FormCarga from './components/pages/FormCarga.jsx';
import MinimalLayout from './layout/MinimalLayout.jsx';
import { CotizacionProvider } from './components/precio/CotizacionContext';
import { FavoritosProvider } from './components/section/FavoritosContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 Providers globales */}
    <CotizacionProvider>
      <FavoritosProvider>
        <BrowserRouter>
          <Routes>
            {/* App maneja home y secciones normales */}
            <Route path="/*" element={<App />} />

            {/* Product detail */}
            <Route path="/producto/:id/:variantId" element={<ProductDetail />} />

            {/* Formulario de carga con layout minimal */}
            <Route
              path="/cargar"
              element={
                <MinimalLayout>
                  <FormCarga />
                </MinimalLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </FavoritosProvider>
    </CotizacionProvider>
  </React.StrictMode>
);