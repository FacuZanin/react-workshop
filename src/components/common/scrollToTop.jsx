// src/components/common/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que se coloca dentro del router para forzar el scroll 
 * al inicio de la página (posición 0,0) cada vez que la ruta cambia.
 */
const ScrollToTop = () => {
  // 💡 Hook de React Router que nos da información sobre la ruta actual
  const { pathname } = useLocation();

  useEffect(() => {
    // 🚨 La acción clave: establece el scroll global en (0, 0)
    window.scrollTo(0, 0); 
    
    // Opcional: si quieres un scroll suave
    // window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [pathname]); // 💡 Dependencia: Se ejecuta cada vez que el pathname cambia

  // Este componente no renderiza nada, solo maneja el efecto secundario del scroll
  return null;
};

export default ScrollToTop;