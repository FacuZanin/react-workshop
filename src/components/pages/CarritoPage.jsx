import { useCarrito } from "../pages/CarritoContext";
import { Trash2 } from "lucide-react";
import "./CarritoPage.css";
import PrecioProducto from "../precio/PrecioProducto";

const CarritoPage = () => {
  const { carrito, toggleCarrito, total } = useCarrito();

  return (
    <div className="carrito-page">
      <h2>Mi Carrito</h2>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">Tu carrito está vacío 🛒</p>
      ) : (
        <>
          <div className="carrito-lista">
            {carrito.map((producto) => (
              <div key={producto.key} className="carrito-item">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="carrito-img"
                />
                <div className="carrito-info">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.marca}</p>
                  {/* ✅ Ahora le paso el producto completo con precioCaja y precioSinCaja */}
                  <div className="precio">
                    <PrecioProducto producto={producto} />
                  </div>

                  <div className="carrito-especificaciones">
                    <p>Tipo: {producto.tipo || "No disponible"}</p>
                    <p>Color: {producto.color || "No disponible"}</p>
                    <p>
                      Distribución: {producto.distribucion || "No disponible"}
                    </p>
                    <p>Origen: {producto.origen || "No disponible"}</p>
                    <p>Fábrica: {producto.fabrica || "No disponible"}</p>
                    <p>Suela: {producto.suela || "No disponible"}</p>
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
            ))}
          </div>

          <div className="carrito-total">
            <h3>Total: ${total.toLocaleString()}</h3>
            <button className="checkout-btn">Finalizar Compra</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarritoPage;
