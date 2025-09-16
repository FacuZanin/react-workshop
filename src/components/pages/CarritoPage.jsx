// CarritoPage.jsx
import { useEffect, useState } from "react";
import { useCarrito } from "../pages/CarritoContext";
import { Trash2 } from "lucide-react";
import "./CarritoPage.css";
import PrecioProducto from "../precio/PrecioProducto";

// ... (funciones parseNumber y getPrecioNumberFrom, no se han modificado) ...

const CarritoPage = () => {
  const { carrito, toggleCarrito, total } = useCarrito();

  return (
    <div className="carrito-page">
      <div className="carrito-list">
        {carrito.map((producto) => {
          const {
            nombre,
            marca,
            color,
            imagen,
            talleSeleccionado, // ✅ Obtener el talle seleccionado
            distribucionSeleccionada, // ✅ Obtener la distribución seleccionada
            tipo,
            origen,
            fabrica,
            suela,
            distribucion // ✅ Mantener por compatibilidad si es necesario
          } = producto;

          return (
            <div key={producto.id} className="carrito-item">
              <img
                src={imagen}
                alt={`${nombre} ${color}`}
                className="carrito-imagen"
              />
              <div className="carrito-details">
                <div className="carrito-titulo">
                  <h3>
                    {marca} {nombre}
                  </h3>
                  <p>{color}</p>
                </div>
                <div className="carrito-precio">
                  <PrecioProducto producto={producto} cantidad={producto.cantidad} />
                </div>
              </div>

              <div className="carrito-specs-container">
                <div className="carrito-especificaciones">
                  {tipo && <p>Tipo: {tipo}</p>}
                  {color && <p>Color: {color}</p>}
                  {/* ✅ Lógica corregida para mostrar solo el talle y distribución seleccionados */}
                  {talleSeleccionado && distribucionSeleccionada ? (
                    <>
                      <p>Talle: {talleSeleccionado}</p>
                      <p>Distribución: {distribucionSeleccionada}</p>
                    </>
                  ) : (
                    // 📌 Fallback para productos sin talle seleccionado si los hubiera
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