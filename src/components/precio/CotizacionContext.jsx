import { createContext, useState, useEffect, useContext } from "react";

const CotizacionContext = createContext();

export const CotizacionProvider = ({ children }) => {
  const [cotizacion, setCotizacion] = useState(() => {
    const saved = localStorage.getItem("cotizacion");
    return saved ? parseInt(saved, 10) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCotizacion = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cotizacion-cache`);
      const text = await res.text();

      // Chequear si es JSON válido
      try {
        const data = JSON.parse(text);
        if (data.cotizacion) {
          setCotizacion(data.cotizacion);
          localStorage.setItem("cotizacion", data.cotizacion);
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      } catch (parseErr) {
        console.error("❌ Error parseando JSON:", parseErr, text);
        setError("Respuesta inválida del servidor");
      }
    } catch (err) {
      console.error("❌ Error obteniendo cotización:", err);
      setError("No se pudo obtener la cotización");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotizacion();

    // Refrescar cada 30 minutos
    const interval = setInterval(fetchCotizacion, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CotizacionContext.Provider value={{ cotizacion, loading, error }}>
      {children}
    </CotizacionContext.Provider>
  );
};

// Hook para usar fácil la cotización
export const useCotizacion = () => useContext(CotizacionContext);
