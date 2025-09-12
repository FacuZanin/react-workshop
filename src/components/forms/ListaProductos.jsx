import "./ListaProductos.css";

const ListaProductos = ({ productos, eliminarProducto, darkMode }) => {
  return (
    <div>
      <h3 className="productos-titulo">
        🧾 Productos cargados: {productos.length}
      </h3>
      <ul className="productos-lista">
        {productos.map((p) => (
          <li
            key={p.id}
            className={`producto-item ${darkMode ? "dark" : ""}`}
          >
            <div className="producto-header">
              <div>
                <h4 className="producto-nombre">{p.nombre}</h4>
                <span className={`producto-sub ${darkMode ? "dark" : ""}`}>
                  {p.marca} - {p.tipo} | Código: {p.codigo}
                </span>
              </div>
              <div className="producto-precio-container">
                <div className="producto-precio">
                  💸 Con caja: ${p.precioCaja} | Sin caja: ${p.precioSinCaja}
                </div>
                <div className="producto-contacto">{p.contacto}</div>
              </div>
            </div>

            <div className="producto-suela">
              <strong>Suela:</strong> {p.suela || "No especificada"}
            </div>

            <p className="producto-descripcion">{p.descripcion}</p>

            <ul className="variantes-lista">
              {p.variantes.map((v) => (
                <li key={v.id} className="variante-item">
                  <div><strong>Colores:</strong> {v.color.join(", ")}</div>
                  <div><strong>Talles:</strong> {v.talles.join(", ")}</div>

                  <div className="variante-links">
                    {v.imagenes?.map((img, i) => (
                      <a
                        key={`img-${i}`}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`variante-img ${darkMode ? "dark" : ""}`}
                      >
                        🖼️ Imagen {i + 1}
                      </a>
                    ))}
                    {v.videos?.map((vid, i) => (
                      <a
                        key={`vid-${i}`}
                        href={vid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`variante-video ${darkMode ? "dark" : ""}`}
                      >
                        🎥 Video {i + 1}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={() => eliminarProducto(p.id)}
              className="btn-eliminar"
            >
              🗑️ Eliminar Producto
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProductos;
