import { createContext, useState, useEffect, useContext } from "react";
import { useCotizacion } from "../precio/CotizacionContext";

const CarritoContext = createContext();

const normalizeItem = (item) => {
  if (!item) return item;
  const copy = { ...item };

  // Normalizar precioCaja
  if (copy.precioCaja == null) {
    if (copy.precio != null && typeof copy.precio === "number") {
      copy.precioCaja = copy.precio;
    } else if (copy.precio && typeof copy.precio === "object" && copy.precio.conCaja != null) {
      copy.precioCaja = copy.precio.conCaja;
    } else if (copy.precio && typeof copy.precio === "string") {
      const cleaned = copy.precio.replace(/[^\d.,-]/g, "").replace(",", ".");
      const n = Number(cleaned);
      if (!isNaN(n)) copy.precioCaja = n;
    }
  }

  // 🔧 Normalizar precioSinCaja igual que precioCaja
  if (copy.precioSinCaja == null && copy.precio && typeof copy.precio === "object" && copy.precio.sinCaja != null) {
    copy.precioSinCaja = copy.precio.sinCaja;
  }

  return copy;
};


export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("carrito");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // normalizar items antiguos
      return parsed.map(normalizeItem);
    } catch (e) {
      console.error("Error parseando carrito desde localStorage:", e);
      return [];
    }
  });

  const { cotizacion } = useCotizacion();

  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (e) {
      console.error("Error guardando carrito:", e);
    }
  }, [carrito]);

  const toggleCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.key === producto.key);
      if (existe) {
        return prev.filter((p) => p.key !== producto.key);
      } else {
        // guarda versión normalizada
        return [...prev, normalizeItem(producto)];
      }
    });
  };

  const getPrecioCaja = (producto) => {
    if (!producto) return 0;
    // Prioridad: producto.precioCaja -> producto.precio (número) -> producto.precio.conCaja -> producto.precio (string parseable)
    if (producto.precioCaja != null && !isNaN(Number(producto.precioCaja))) return Number(producto.precioCaja);
    if (producto.precio != null && typeof producto.precio === "number") return Number(producto.precio);
    if (producto.precio && typeof producto.precio === "object" && producto.precio.conCaja != null) return Number(producto.precio.conCaja);
    if (producto.precio && typeof producto.precio === "string") {
      const cleaned = producto.precio.replace(/[^\d.,-]/g, "").replace(",", ".");
      const n = Number(cleaned);
      if (!isNaN(n)) return n;
    }
    return 0;
  };

  const total = carrito.reduce((acc, producto) => {
    const precioCaja = getPrecioCaja(producto);
    if (!precioCaja) return acc;
    const precioPesos = cotizacion ? Math.round(precioCaja * cotizacion) : precioCaja;
    return acc + precioPesos;
  }, 0);

  return (
    <CarritoContext.Provider value={{ carrito, toggleCarrito, total, getPrecioCaja }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);