import { useEffect, useState } from "react";
import { useCarrito } from "../pages/CarritoContext";
import { Trash2 } from "lucide-react";
import "./CarritoPage.css";
import PrecioProducto from "../precio/PrecioProducto";
import { Link } from "react-router-dom";

const CarritoPage = () => {
  const { carrito, decreaseQuantity, total, clearCarrito } = useCarrito();

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
        <div className="carrito-header">
          <p className="header-articulo">Artículo</p>
          <p className="header-descripcion">Descripción</p>
          <p className="header-cantidad">Cantidad</p>
          <p className="header-precio">Precio</p>
          <div className="placeholder-btn"></div>
        </div>
      </div>
      <div className="carrito-lista">
        {carrito.map((producto) => {
          const {
            nombre,
            marca,
            color,
            imagenes,
            talleSeleccionado,
            distribucionSeleccionada,
            origen,
            fabrica,
            suela,
            distribucion,
            precioTotalItem,
            cantidad,
            cantidadEnCarrito,
            productoId,
            tipo
          } = producto;
          // Construir el enlace al producto
          const productLink = `/producto/${producto.idBase || producto.id}/${
            producto.id
          }`;
          return (
            <div key={producto.normalizedId} className="carrito-item">
              <Link to={productLink} className="carrito-img-link">
                <img
                  src={imagenes[0]}
                  alt={`${nombre} ${color}`}
                  className="carrito-img"
                />
              </Link>
              <div className="carrito-specs-container">
                <Link to={productLink} className="carrito-title-link">
                  <div className="carrito-info">
                    <h3>
                      <strong>
                        {marca} {nombre}
                      </strong>{" "} <br />

                    </h3>
                    <p>Cantidad: {cantidad}</p>
                    <p>Color: {color}</p>
                    <p>Tipo: {tipo}</p>
                  </div>
                </Link>
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
                        {Object.entries(distribucion).map(
                          ([talle, detalle]) => (
                            <p key={talle} className="distribucion-item">
                              <strong>{talle}:</strong> {detalle}
                            </p>
                          )
                        )}
                      </>
                    )
                  )}
                  {origen && <p>Origen: {origen}</p>}
                  {fabrica && <p>Fábrica: {fabrica}</p>}
                  {suela && <p>Suela: {suela}</p>}
                </div>

                <div className="carrito-cantidad-cantidad">
                  <p>{cantidadEnCarrito}</p>
                </div>

                <div className="carrito-precio">
                  {/* ✅ Se muestra la nueva propiedad ya calculada */}
                  <p>${precioTotalItem.toLocaleString()}</p>
                </div>
              </div>
              <button
                className="eliminar-btn"
                onClick={() => decreaseQuantity(producto)}
                aria-label="Disminuir cantidad o eliminar del carrito"
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="carrito-total">
        <button
          className="clear-carrito-btn"
          onClick={clearCarrito}
          disabled={carrito.length === 0}
          title="Eliminar todos los productos"
        >
          Limpiar Carrito
        </button>
        <h3>Total: ${total.toLocaleString()}</h3>
        <button className="checkout-btn">Finalizar Compra</button>
      </div>
    </div>
  );
};

export default CarritoPage;
