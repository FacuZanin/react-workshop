// CarritoContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useCotizacion } from "../precio/CotizacionContext";

const CarritoContext = createContext();

// ... la función normalizeItem se mantiene igual

export const CarritoProvider = ({ children }) => {
  const { cotizacion } = useCotizacion();
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      const parsed = saved ? JSON.parse(saved) : [];
      // ✅ VERIFICACIÓN CLAVE: Asegurarse de que `parsed` sea un array, si no, usar []
      if (!Array.isArray(parsed)) {
        console.error("Valor de carrito en localStorage no es un array. Se inicializará como vacío.");
        return [];
      }
      return parsed;
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  const getPrecioCaja = (producto) => {
    // ... la función se mantiene igual
  };

  const toggleCarrito = (producto) => {
    // ... la función se mantiene igual
  };

  const total = carrito.reduce((acc, producto) => {
    const precioCaja = getPrecioCaja(producto);
    if (!precioCaja) return acc;
    const precioPesos = cotizacion
      ? Math.round(precioCaja * cotizacion)
      : precioCaja;
    return acc + precioPesos * producto.cantidad;
  }, 0);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  return (
    <CarritoContext.Provider
      value={{ carrito, total, toggleCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);