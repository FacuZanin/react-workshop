// CarritoContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useCotizacion } from "../precio/CotizacionContext";
import { useLocalStorage } from "../hooks/useLocalStorage"; 

const CarritoContext = createContext();

const normalizeItem = (item) => {
  if (item.talleSeleccionado) {
    return {
      ...item,
      normalizedId: `${item.id}-${item.talleSeleccionado}`
    };
  }
  return { ...item, normalizedId: item.id };
};

export const CarritoProvider = ({ children }) => {
  const { cotizacion } = useCotizacion();
  const [carrito, setCarrito] = useLocalStorage("carrito", []);
  // ✅ Nuevo estado para la notificación Toast
  const [toast, setToast] = useState({ visible: false, message: '' });

  const getPrecioCaja = (producto) => {
    return producto.precioCaja || producto.precio || 0;
  };

  const toggleCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoNormalizado = normalizeItem(producto);
      const existeEnCarrito = prevCarrito.find(
        (item) => item.normalizedId === productoNormalizado.normalizedId
      );

      if (existeEnCarrito) {
        // Lógica de eliminación: si el producto ya existe, se elimina
        return prevCarrito.filter(
          (item) => item.normalizedId !== productoNormalizado.normalizedId
        );
      } else {
        // ✅ LÓGICA DE NOTIFICACIÓN: Se activa el toast al agregar
        const message = `${productoNormalizado.marca} ${productoNormalizado.nombre}\nTalle: ${productoNormalizado.talleSeleccionado || 'N/A'}\nAgregado al carrito`;
        setToast({ visible: true, message: message });
        
        // Si el producto no existe, se agrega con cantidad 1
        return [...prevCarrito, { ...productoNormalizado, cantidad: 1 }];
      }
    });
  };
  
  // ✅ Nueva función para ocultar el toast
  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

  const total = carrito.reduce((acc, producto) => {
    const precioCaja = getPrecioCaja(producto);
    if (!precioCaja) return acc;
    const precioPesos = cotizacion
      ? Math.round(precioCaja * cotizacion)
      : precioCaja;
    return acc + precioPesos * producto.cantidad;
  }, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, total, toggleCarrito, toast, hideToast }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);