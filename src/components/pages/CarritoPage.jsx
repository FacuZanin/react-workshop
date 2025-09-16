import { useEffect, useState } from "react";
import { useCarrito } from "../pages/CarritoContext";
import { Trash2 } from "lucide-react";
import "./CarritoPage.css";
import PrecioProducto from "../precio/PrecioProducto";

const parseNumber = (v) => {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.,-]/g, "").replace(",", ".");
    const n = Number(cleaned);
    return isNaN(n) ? null : n;
  }
  if (typeof v === "object") {
    if (v.conCaja != null) return parseNumber(v.conCaja);
  }
  return null;
};

const getPrecioNumberFrom = (item, full) => {
  // intenta en el item primero, luego en el full product
  const candidates = [
    item?.precioCaja,
    item?.precio,
    item?.precio?.conCaja,
    full?.precio?.conCaja,
    full?.precioCaja,
    full?.precio,
  ];

  for (const c of candidates) {
    const n = parseNumber(c);
    if (n != null) return n;
  }
  return 0;
};

const CarritoPage = () => {
  const { carrito, toggleCarrito, total } = useCarrito();
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    // carga catálogo para fallback de campos faltantes
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => setCatalog(data || []))
      .catch((err) => {
        console.warn("No se pudo cargar /data/productos.json:", err);
        setCatalog([]);
      });
  }, []);

  if (carrito.length === 0) {
    return (
      <div className="carrito-page">
        <h2>Mi Carrito</h2>
        <p className="carrito-vacio">Tu carrito está vacío 🛒</p>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <h2>Mi Carrito</h2>

      <div className="carrito-lista">
        {carrito.map((producto) => {
          const full =
            catalog.find((p) => String(p.id) === String(producto.id)) || null;

          const nombre = producto.nombre || full?.nombre || "Producto";
          const marca = producto.marca || full?.marca || "";
          const descripcion = producto.descripcion || full?.descripcion || "";
          const tipo = producto.tipo || full?.tipo;
          const color =
            producto.color ||
            full?.variantes?.[0]?.color?.[0] ||
            producto.color;
          const distribucion = producto.distribucion || full?.distribucion;
          const origen = producto.origen || full?.origen;
          const fabrica = producto.fabrica || full?.fabrica;
          const suela = producto.suela || full?.suela;
          const cantidad = producto.cantidad || full?.cantidad;
          const imagen =
            producto.imagen ||
            producto.imagenes?.[0] ||
            full?.variantes?.[0]?.imagenUrl ||
            "";

          const precioNumber = getPrecioNumberFrom(producto, full);
          const precioFormateado = precioNumber
            ? `$${precioNumber.toLocaleString("es-AR")}`
            : "Consultar precio";

          return (
            <div key={producto.key} className="carrito-item">
              {imagen ? (
                <img src={imagen} alt={nombre} className="carrito-img" />
              ) : (
                <div className="carrito-img no-image">Sin imagen</div>
              )}

              <div className="carrito-info">
                <h3>
                  {marca} {nombre} {color} {"x"} {cantidad}
                </h3>
                <div className="precio">
                  <PrecioProducto producto={producto} cantidad={producto.cantidad} />
                </div>
              </div>

              <div className="carrito-specs-container">
                <div className="carrito-especificaciones">
                  {tipo && <p>Tipo: {tipo}</p>}
                  {color && <p>Color: {color}</p>}
                  {distribucion && (
                    <>
                      <p>Distribución:</p>
                      {Object.entries(distribucion).map(([talle, detalle]) => (
                        <p key={talle} className="distribucion-item">
                          <strong>{talle}:</strong> {detalle}
                        </p>
                      ))}
                    </>
                  )}
                  {origen && <p>Origen: {origen}</p>}
                  {fabrica && <p>Fábrica: {fabrica}</p>}
                  {suela && <p>Suela: {suela}</p>}
                </div>
              </div>

              <button
                className="eliminar-btn"
                onClick={() => toggleCarrito(producto)}
                aria-label="Eliminar del carrito"
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="carrito-total">
        <h3>Total: ${total.toLocaleString()}</h3>
        <button className="checkout-btn">Finalizar Compra</button>
      </div>
    </div>
  );
};

export default CarritoPage;
