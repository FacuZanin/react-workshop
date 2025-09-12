import { useCotizacion } from "./CotizacionContext";

const PrecioGrid = ({ producto, className = "" }) => {
  const { cotizacion, loading, error } = useCotizacion();

  if (loading) return <span className={`${className}`}>Cargando...</span>;
  if (error) return <span className={`${className}`}>Error</span>;
  if (!cotizacion) return null;

  // Calcular precio en ARS
  const precioCajaPesos = producto.precioCaja * cotizacion;
  const precioSinCajaPesos = producto.precioSinCaja * cotizacion;

  // Mostrar con preferencia "con caja", si existe
  const precioFinal =
    producto.precioCaja > 0 ? precioCajaPesos : precioSinCajaPesos;

  return (
    <span className={`precio-grid ${className}`}>
      ${precioFinal.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
    </span>
  );
};

export default PrecioGrid;
