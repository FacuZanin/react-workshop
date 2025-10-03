import { useCotizacion } from "./CotizacionContext";

const PrecioGrid = ({ producto, className = "" }) => {
  // Asegúrate de que useCotizacion se importe correctamente
  const { cotizacion, loading, error } = useCotizacion();

  if (loading) return <span className={`${className}`}>Cargando...</span>;
  if (error) return <span className={`${className}`}>Error</span>;
  // Si la cotización no está cargada, no podemos calcular el precio
  if (!cotizacion) return null; 

  // 🚨 CORRECCIÓN CLAVE: Usamos || 0 para garantizar que sea un número.
  // Esto evita que 'undefined * number' resulte en NaN.
  const precioDolaresCaja = producto.precioCaja || 0;
  const precioDolaresSinCaja = producto.precioSinCaja || 0;

  // Calcular precio en ARS
  const precioCajaPesos = precioDolaresCaja * cotizacion;
  const precioSinCajaPesos = precioDolaresSinCaja * cotizacion;

  // Mostrar con preferencia "con caja", si existe
  const precioFinal =
    precioDolaresCaja > 0 ? precioCajaPesos : precioSinCajaPesos;
  
  // Si ambos precios son 0 (o no existen), mostramos un mensaje o simplemente null
  if (precioFinal === 0) {
    // Puedes cambiar este mensaje si prefieres mostrar 'Consultar Precio' o similar
    return <span className={`precio-grid ${className}`}>Consultar</span>;
  }

  return (
    <span className={`precio-grid ${className}`}>
      ${precioFinal.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
    </span>
  );
};

export default PrecioGrid;