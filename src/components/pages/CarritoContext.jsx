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
        // Lógica de incremento
        return prevCarrito.map(item =>
          item.normalizedId === productoNormalizado.normalizedId
            ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 }
            : item
        );
      } else {
        // Lógica de adición
        const message = `${productoNormalizado.marca} ${productoNormalizado.nombre}\nTalle: ${productoNormalizado.talleSeleccionado || 'N/A'}\nAgregado al carrito`;
        setToast({ visible: true, message: message });
        
        return [...prevCarrito, { ...productoNormalizado, cantidadEnCarrito: 1 }];
      }
    });
  };

  // ✅ NUEVA FUNCIÓN para disminuir la cantidad o eliminar el producto
  const decreaseQuantity = (producto) => {
    setCarrito((prevCarrito) => {
      const productoNormalizado = normalizeItem(producto);
      const productoEnCarrito = prevCarrito.find(
        (item) => item.normalizedId === productoNormalizado.normalizedId
      );
      
      if (!productoEnCarrito) {
        return prevCarrito;
      }
      
      // Si la cantidad es 1, se elimina el producto por completo
      if (productoEnCarrito.cantidadEnCarrito === 1) {
        return prevCarrito.filter(
          (item) => item.normalizedId !== productoEnCarrito.normalizedId
        );
      } else {
        // Si la cantidad es mayor a 1, se disminuye en 1
        return prevCarrito.map((item) =>
          item.normalizedId === productoEnCarrito.normalizedId
            ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito - 1 }
            : item
        );
      }
    });
  };
  
  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

  const total = carrito.reduce((acc, producto) => {
    const precioCaja = getPrecioCaja(producto);
    if (!precioCaja) return acc;
    const precioPesos = cotizacion
      ? Math.round(precioCaja * cotizacion)
      : precioCaja;
    // Ahora usa cantidadEnCarrito
    return acc + precioPesos * producto.cantidadEnCarrito;
  }, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, total, toggleCarrito, decreaseQuantity, toast, hideToast }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);