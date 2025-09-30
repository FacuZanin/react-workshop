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
  const [toast, setToast] = useState({ visible: false, message: ''});

  const getPrecioCaja = (producto) => {
    return producto.precioCaja || producto.precio || 0;
  };

  // ✅ Nueva función para calcular el precio total del ítem con cotización
  const calculateItemPrice = (producto, currentCotizacion) => {
    const precioBase = getPrecioCaja(producto) * Number(producto.cantidad);
    const precioPesos = currentCotizacion
      ? Math.round(precioBase * currentCotizacion)
      : precioBase;
    return precioPesos * producto.cantidadEnCarrito;
  };
  
  // ✅ Recalcula los precios de todos los items en el carrito cuando la cotización cambia.
  useEffect(() => {
    setCarrito((prevCarrito) => {
      // Usamos el estado más reciente de la cotización para el cálculo
      return prevCarrito.map(item => ({
        ...item,
        precioTotalItem: calculateItemPrice(item, cotizacion)
      }));
    });
  }, [cotizacion]);

  const toggleCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoNormalizado = normalizeItem(producto);
      const existeEnCarrito = prevCarrito.find(
        (item) => item.normalizedId === productoNormalizado.normalizedId
      );

      let updatedCarrito;
      let toastMessage;

      if (existeEnCarrito) {
        // Lógica de incremento
        updatedCarrito = prevCarrito.map(item =>
          item.normalizedId === productoNormalizado.normalizedId
            ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 }
            : item
        );
        toastMessage = `${productoNormalizado.marca} ${productoNormalizado.nombre}\nTalle: ${productoNormalizado.talleSeleccionado}\nCantidad en carrito: ${existeEnCarrito.cantidadEnCarrito + 1}`;
      } else {
        // Lógica de adición
        updatedCarrito = [...prevCarrito, { ...productoNormalizado, cantidadEnCarrito: 1 }];
        toastMessage = `${productoNormalizado.marca} ${productoNormalizado.nombre}\nTalle: ${productoNormalizado.talleSeleccionado || 'N/A'}\nAgregado al carrito`;
      }
      
      // ✅ Se actualizan los precios de todos los productos en el carrito después del cambio de cantidad
      const finalCarrito = updatedCarrito.map(item => ({
        ...item,
        precioTotalItem: calculateItemPrice(item, cotizacion)
      }));

      setToast({ visible: true, message: toastMessage });
      return finalCarrito;
    });
  };

  const decreaseQuantity = (producto) => {
    setCarrito((prevCarrito) => {
      const productoNormalizado = normalizeItem(producto);
      const productoEnCarrito = prevCarrito.find(
        (item) => item.normalizedId === productoNormalizado.normalizedId
      );
      
      if (!productoEnCarrito) {
        return prevCarrito;
      }
      
      let updatedCarrito;

      if (productoEnCarrito.cantidadEnCarrito === 1) {
        updatedCarrito = prevCarrito.filter(
          (item) => item.normalizedId !== productoEnCarrito.normalizedId
        );
      } else {
        updatedCarrito = prevCarrito.map((item) =>
          item.normalizedId === productoEnCarrito.normalizedId
            ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito - 1 }
            : item
        );
      }
      
      // ✅ Se actualizan los precios de todos los productos después del cambio de cantidad
      return updatedCarrito.map(item => ({
        ...item,
        precioTotalItem: calculateItemPrice(item, cotizacion)
      }));
    });
  };
  
  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

    const clearCarrito = () => {
    setCarrito([]);
  };
  
  // ✅ El cálculo del total ahora suma los "precioTotalItem"
  const total = carrito.reduce((acc, producto) => {
    return acc + (producto.precioTotalItem || 0);
  }, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, total, toggleCarrito, decreaseQuantity, clearCarrito,toast, hideToast }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);