import productosData from "../productos.json";

const Catalogo = ({ darkMode }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>🛍️ Catálogo de Productos</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {productosData.map((producto) => (
          <li
            key={producto.id}
            style={{
              marginBottom: 20,
              background: darkMode ? "#2c2c2c" : "#f4f4f4",
              padding: 20,
              borderRadius: 10,
              boxShadow: darkMode
                ? "0 0 10px rgba(255,255,255,0.05)"
                : "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{producto.nombre}</h3>
            <p style={{ margin: 0 }}>
              <strong>Marca:</strong> {producto.marca} | <strong>Tipo:</strong>{" "}
              {producto.tipo} | <strong>Código:</strong> {producto.codigo}
            </p>
            <p>
              <strong>Precio:</strong> ${producto.precio}
            </p>
            <p>{producto.descripcion}</p>

            <h4>Variantes:</h4>
            <ul>
              {producto.variantes.map((v) => (
                <li key={v.id} style={{ marginBottom: 10 }}>
                  <strong>Color:</strong> {v.color} |{" "}
                  <strong>Talles:</strong> {v.talles.join(", ")} <br />
                  {v.imagenUrl && (
                    <a
                      href={v.imagenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🖼️ Ver Imagen
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalogo;
