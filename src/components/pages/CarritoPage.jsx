// CarritoPage.jsx
import { useEffect, useState } from "react";
import { useCarrito } from "../pages/CarritoContext";
import { Trash2 } from "lucide-react";
import "./CarritoPage.css";
import PrecioProducto from "../precio/PrecioProducto";

const CarritoPage = () => {
  const { carrito, toggleCarrito, total } = useCarrito();

  if (carrito.length === 0) {
    return (
      <div className="carrito-page">
        <h2>Tu Carrito</h2>
        <p className="carrito-vacio">El carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <h2>Tu Carrito</h2>
      <div className="carrito-lista">
        {carrito.map((producto) => {
          const {
            nombre,
            marca,
            color,
            imagenes, // ✅ CORREGIDO: ahora desestructuramos el arreglo de imágenes
            talleSeleccionado,
            distribucionSeleccionada,
            origen,
            fabrica,
            suela,
            distribucion,
            precioCaja,
            cantidad
          } = producto;

          return (
            <div key={producto.normalizedId} className="carrito-item">
              <img
                src={imagenes[0]} // ✅ CORREGIDO: usamos la primera imagen del arreglo
                alt={`${nombre} ${color}`}
                className="carrito-img"
              />
              <div className="carrito-specs-container">
                <div className="carrito-details">
                  <div className="carrito-info">
                    <h3><strong>
                      {marca} {nombre}
                    </strong> </h3>
                    <p>{color}</p>
                  </div>
                </div>

                <div className="carrito-especificaciones">
                  {talleSeleccionado && distribucionSeleccionada ? (
                    <>
                      <p>Talle: {talleSeleccionado}</p>
                      <p>Distribución: {distribucionSeleccionada}</p>
                    </>
                  ) : (
                    distribucion && (
                      <>
                        <p>Distribución:</p>
                        {Object.entries(distribucion).map(([talle, detalle]) => (
                          <p key={talle} className="distribucion-item">
                            <strong>{talle}:</strong> {detalle}
                          </p>
                        ))}
                      </>
                    )
                  )}
                  {origen && <p>Origen: {origen}</p>}
                  {fabrica && <p>Fábrica: {fabrica}</p>}
                  {suela && <p>Suela: {suela}</p>}
                </div>

                <div className="carrito-cantidad-precio">
                  <p>Cantidad: {cantidad}</p>
                  {/* ✅ ELIMINADO: Se quita esta línea */}
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