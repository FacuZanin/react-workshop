import "./Formulario.css";

const TALLE_OPCIONES = ["21 - 26", "27 - 34", "35 - 40", "39 - 44", "45 +"];
const MARCAS_OPCIONES = [
  "Adidas", "Asics", "Boss", "CAT", "Converse", "Fila",
  "Lacoste", "Mizuno", "New Balance", "Nike", "Olympikus",
  "Puma", "Tommy Hilfiger", "Veja", "Vans"
];

const ORIGEN_OPCIONES = ["Argentina","Brasil","China"]
const TIPOS_OPCIONES = [
  "Borcego", "Botines", "Botita", "Crocs", "Infantil",
  "Ojota", "Sandalia", "Zapato", "Zapatilla"
];
const SUELAS_OPCIONES = ["Caucho TR", "EVA", "Microexpandido", "PVC", "Vulcanizado"];
const COLORES_OPCIONES = [
  { nombre: "Animal Print", valor: "linear-gradient(45deg,#15120B,#984A18,#EBBD73,#EEE1CF,#EBBD73,#984A18,#15120B)" },
  { nombre: "Amarillo", valor: "yellow" },
  { nombre: "Azul", valor: "blue" },
  { nombre: "Beige", valor: "beige" },
  { nombre: "Blanco", valor: "white" },
  { nombre: "Bordo", valor: "#800020" },
  { nombre: "Celeste", valor: "#87CEEB" },
  { nombre: "Dorado", valor: "#FFD700" },
  { nombre: "Fucsia", valor: "fuchsia" },
  { nombre: "Gris", valor: "gray" },
  { nombre: "Marrón", valor: "#8B4513" },
  { nombre: "Naranja", valor: "orange" },
  { nombre: "Negro", valor: "black" },
  { nombre: "Rojo", valor: "red" },
  { nombre: "Rosa", valor: "pink" },
  { nombre: "Verde", valor: "green" },
  { nombre: "Violeta", valor: "#4c2882" },
  { nombre: "Varios", valor: "linear-gradient(45deg, red, yellow, green, blue, violet)" }
];

const Formulario = ({
  form, setForm,
  nuevaVariante, setNuevaVariante,
  handleFormChange, toggleColor, toggleTalle,
  agregarVariante, eliminarVariante,
  handleSubmit, darkMode,
  mantenerContacto, setMantenerContacto,
  mantenerDistribucion, setMantenerDistribucion   // ✅ AGREGADAS
}) => {

  const aplicarMarca = (marca) => setForm((prev) => ({ ...prev, marca: marca.trim() }));
  const aplicarTipo = (tipo) => setForm((prev) => ({ ...prev, tipo: tipo.trim() }));
  const aplicarSuela = (suela) => setForm((prev) => ({ ...prev, suela: suela.trim() }));

  return (
    <form
      onSubmit={handleSubmit}
      className={`formulario ${darkMode ? "dark" : "light"}`}
    >
      {/* Fábrica + Modelo */}
      <div className="fila-inputs">
        <input name="fabrica" placeholder="Fábrica" value={form.fabrica} onChange={handleFormChange} required />
        <input name="nombre" placeholder="Modelo" value={form.nombre} onChange={handleFormChange} required />
      </div>

      {/* Checkbox mantener fábrica */}
      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={mantenerContacto}
            onChange={(e) => setMantenerContacto(e.target.checked)}
          />
          Mantener fábrica para el próximo producto
        </label>
      </div>

      {/* Precios */}
      <div className="fila-inputs">
        <input name="precioCaja" placeholder="Precio con caja" value={form.precioCaja} onChange={handleFormChange} required type="number" />
        <input name="precioSinCaja" placeholder="Precio sin caja (opcional)" value={form.precioSinCaja} onChange={handleFormChange} type="number" />
      </div>

      {/* Colaboración */}
      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={form.colaboracion}
            onChange={(e) => setForm((prev) => ({ ...prev, colaboracion: e.target.checked }))}
          />
          Producto en colaboración
        </label>
      </div>

      {/* Marca */}
      <div className="opciones">
        <strong>Seleccionar Marca:</strong><br />
        {MARCAS_OPCIONES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => aplicarMarca(m)}
            className={`opcion ${form.marca === m ? "activo" : ""}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Tipo */}
      <div className="opciones">
        <strong>Tipo de Calzado:</strong><br />
        {TIPOS_OPCIONES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => aplicarTipo(t)}
            className={`opcion ${form.tipo === t ? "activo" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Suela */}
      <div className="opciones">
        <strong>Tipo de Suela:</strong><br />
        {SUELAS_OPCIONES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => aplicarSuela(s)}
            className={`opcion ${form.suela === s ? "activo" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
      {/* Origen */}
<div className="opciones">
  <strong>Origen:</strong><br />
  {ORIGEN_OPCIONES.map((o) => (
    <button
      key={o}
      type="button"
      onClick={() => setForm((prev) => ({ ...prev, origen: o }))}
      className={`opcion ${form.origen === o ? "activo" : ""}`}
    >
      {o}
    </button>
  ))}
</div>


      {/* Descripción */}
      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleFormChange}
        rows={6}
      />
<div className="form-group">
  <label htmlFor="distribucion">Distribución de talles</label>
  <textarea
    id="distribucion"
    name="distribucion"
    value={form.distribucion}
    onChange={handleFormChange}
    placeholder="Ej: 1x 38, 2x 39, 2x 40, 1x 41..."
  />
  <div className="checkbox-group">
    <label>
      <input
        type="checkbox"
        checked={mantenerDistribucion}
        onChange={(e) => setMantenerDistribucion(e.target.checked)}
      />
      Mantener distribución
    </label>
  </div>
</div>

      {/* Colores */}
      <div className="colores">
        <strong>Seleccionar Color (uno o más):</strong><br />
        <div className="colores-container">
          {COLORES_OPCIONES.map(({ nombre, valor }) => (
            <div
              key={nombre}
              onClick={() => toggleColor(nombre)}
              className={`color ${nuevaVariante.color.includes(nombre) ? "activo" : ""}`}
              style={{ background: valor }}
              title={nombre}
            />
          ))}
        </div>
      </div>

      {/* Imágenes */}
      <div className="imagenes">
        <strong>Imágenes:</strong>
        {(nuevaVariante.imagenes || []).map((img, index) => (
          <div key={`${nuevaVariante.key || ""}-${index}`} className="fila-imagen">
            <input
              type="text"
              placeholder={`URL de imagen ${index + 1}`}
              value={img}
              onChange={(e) => {
                const nuevas = [...(nuevaVariante.imagenes || [])];
                nuevas[index] = e.target.value;
                setNuevaVariante((prev) => ({ ...prev, imagenes: nuevas }));
              }}
            />
            <button
              type="button"
              className="btn-rojo"
              onClick={() =>
                setNuevaVariante((prev) => ({
                  ...prev,
                  imagenes: (prev.imagenes || []).filter((_, i) => i !== index)
                }))
              }
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-azul"
          onClick={() =>
            setNuevaVariante((prev) => ({ ...prev, imagenes: [...(prev.imagenes || []), ""] }))
          }
        >
          ➕ Agregar imagen
        </button>
      </div>

      {/* Videos */}
      <input
        type="text"
        placeholder="URL de video (opcional) — Enter para agregar"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            setNuevaVariante((prev) => ({
              ...prev,
              videos: [...(prev.videos || []), e.currentTarget.value.trim()]
            }));
            e.currentTarget.value = "";
            e.preventDefault();
          }
        }}
      />
      <ul>
        {(nuevaVariante.videos || []).map((vid, index) => (
          <li key={index}>
            <a href={vid} target="_blank" rel="noopener noreferrer">Video {index + 1}</a>
            <button
              className="btn-rojo"
              onClick={() =>
                setNuevaVariante((prev) => ({
                  ...prev,
                  videos: (prev.videos || []).filter((_, i) => i !== index)
                }))
              }
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {/* Talles */}
      <div className="opciones">
        <strong>Seleccionar Talles:</strong><br />
        {TALLE_OPCIONES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggleTalle(t)}
            className={`opcion ${nuevaVariante.talles.includes(t) ? "activo-verde" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Botón agregar variante */}
      <button type="button" className="btn-azul" onClick={agregarVariante}>
        Agregar Variante
      </button>

      {/* Lista variantes añadidas */}
      <div className="lista-variantes">
        <strong>Variantes añadidas:</strong>
        <ul>
          {form.variantes.map((v) => (
            <li key={v.id}>
              Colores: {v.color.join(", ")} — Talles: {v.talles.join(", ")}<br />
              {v.imagenes?.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noopener noreferrer">🖼️ Imagen {i + 1} </a>
              ))}
              {v.videos?.map((vid, i) => (
                <a key={i} href={vid} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                  🎥 Video {i + 1}
                </a>
              ))}
              <button className="btn-rojo" onClick={() => eliminarVariante(v.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón submit */}
      <button type="submit" className="btn-verde">
        Agregar Producto
      </button>
    </form>
  );
};

export default Formulario;
