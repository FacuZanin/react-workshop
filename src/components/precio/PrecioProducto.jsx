import { useCotizacion } from "./CotizacionContext";

const PrecioProducto = ({ producto }) => {
  const { cotizacion, loading, error } = useCotizacion();

  // 🔹 Mientras carga
  if (loading) return <p>⏳ Cargando precio...</p>;

  // 🔹 Si hubo error
  if (error) return <p>❌ {error}</p>;

  // 🔹 Si no hay cotización disponible
  if (!cotizacion) return <p>⚠️ Cotización no disponible</p>;

  // 🔹 Convertimos a pesos y redondeamos
  const precioCajaPesos = Math.floor(producto.precioCaja * cotizacion);
  const precioSinCajaPesos = producto.precioSinCaja
    ? Math.floor(producto.precioSinCaja * cotizacion)
    : null;

  return (
    <div>
      <p>
        💵 Precio con caja: <strong>${precioCajaPesos.toLocaleString("es-AR")}</strong>
      </p>
      {precioSinCajaPesos ? (
        <p>
          📦 Precio sin caja: <strong>${precioSinCajaPesos.toLocaleString("es-AR")}</strong>
        </p>
      ) : (
        <p>📦 Sin caja, no disponible</p>
      )}
    </div>
  );
};

export default PrecioProducto;

