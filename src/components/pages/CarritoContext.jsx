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
    } else if (
      copy.precio &&
      typeof copy.precio === "object" &&
      copy.precio.conCaja != null
    ) {
      copy.precioCaja = copy.precio.conCaja;
    } else if (copy.precio && typeof copy.precio === "string") {
      const cleaned = copy.precio.replace(/[^\\d.,-]/g, "").replace(",", ".");
      const n = Number(cleaned);
      if (!isNaN(n)) copy.precioCaja = n;
    }
  }

  // 🔧 Normalizar precioSinCaja igual que precioCaja
  if (
    copy.precioSinCaja == null &&
    copy.precio &&
    typeof copy.precio === "object" &&
    copy.precio.sinCaja != null
  ) {
    copy.precioSinCaja = copy.precio.sinCaja;
  }

  return copy;
};

export const CarritoProvider = ({ children }) => {
  const { cotizacion } = useCotizacion();
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  const getPrecioCaja = (producto) => {
    if (!producto) return 0;
    // Prioridad: producto.precioCaja -> producto.precio (número) -> producto.precio.conCaja -> producto.precio (string parseable)
    if (producto.precioCaja != null && !isNaN(Number(producto.precioCaja)))
      return Number(producto.precioCaja);
    if (producto.precio != null && typeof producto.precio === "number")
      return Number(producto.precio);
    if (
      producto.precio &&
      typeof producto.precio === "object" &&
      producto.precio.conCaja != null
    )
      return Number(producto.precio.conCaja);
    if (producto.precio && typeof producto.precio === "string") {
      const cleaned = producto.precio.replace(/[^\\d.,-]/g, "").replace(",", ".");
      const n = Number(cleaned);
      if (!isNaN(n)) return n;
    }
    return 0;
  };

  const toggleCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.some((p) => p.id === producto.id);
      if (existe) {
        return prev.filter((p) => p.id !== producto.id);
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const total = carrito.reduce((acc, producto) => {
    const precioCaja = getPrecioCaja(producto);
    if (!precioCaja) return acc;
    const precioPesos = cotizacion
      ? Math.round(precioCaja * cotizacion)
      : precioCaja;
    
    // ✅ CAMBIO CLAVE: Multiplicar el precio por la cantidad del producto
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