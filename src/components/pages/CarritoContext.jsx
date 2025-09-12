import { createContext, useState, useEffect, useContext } from "react";
import { useCotizacion } from "../precio/CotizacionContext"; // 👈 usamos tu contexto real

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("carrito");
    return saved ? JSON.parse(saved) : [];
  });

  const { cotizacion } = useCotizacion(); // 👈 obtenemos cotización

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ✅ Agregar o quitar del carrito
  const toggleCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.key === producto.key);
      if (existe) {
        return prev.filter((p) => p.key !== producto.key);
      } else {
        return [...prev, producto];
      }
    });
  };

  // ✅ Calcular total dinámico con cotización
const total = carrito.reduce((acc, producto) => {
  if (!cotizacion) return acc;

  const precioCajaPesos = producto.precioCaja
    ? Math.floor(producto.precioCaja * cotizacion)
    : 0;

  return acc + precioCajaPesos;
}, 0);



  return (
    <CarritoContext.Provider value={{ carrito, toggleCarrito, total }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
