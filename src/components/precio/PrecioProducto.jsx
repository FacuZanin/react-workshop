import { useCotizacion } from "./CotizacionContext";

const PrecioProducto = ({ producto, cantidad = 1 }) => {
  const { cotizacion, loading, error } = useCotizacion();

  // 🔹 Mientras carga
  if (loading) return <p>⏳ Cargando precio...</p>;

  // 🔹 Si hubo error
  if (error) return <p>❌ {error}</p>;

  // 🔹 Si no hay cotización disponible
  if (!cotizacion) return <p>⚠️ Cotización no disponible</p>;

  // 🔹 Calcular el precio en pesos
  const precioCajaPesos = producto.precioCaja
    ? producto.precioCaja * cotizacion
    : 0;
  const precioSinCajaPesos = producto.precioSinCaja
    ? producto.precioSinCaja * cotizacion
    : 0;

  // 🔹 Seleccionamos el precio a mostrar (se prefiere el precio con caja)
  const precioFinal = precioCajaPesos > 0 ? precioCajaPesos : precioSinCajaPesos;

  // ✅ Multiplicamos por la cantidad del producto
  const precioTotal = precioFinal * cantidad;

  return (
    <div>
      {precioTotal > 0 ? (
        <h4>
        <p> 
          $ {precioTotal.toLocaleString("es-AR")}{" "}valor por unidad
        </p></h4>
      ) : (
        <p>Consultar precio</p>
      )}
    </div>
  );
};

export default PrecioProducto;