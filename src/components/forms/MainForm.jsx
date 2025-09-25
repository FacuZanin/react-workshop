import React, { useState } from "react";
import Formulario from "./Formulario";
import ListaProductos from "./ListaProductos";
import "./MainForm.css";

// Convierte un enlace de Google Drive al formato directo de imágenes
const convertirLinkDrive = (url) => {
  if (!url) return url;
  try {
    if (url.includes("lh3.googleusercontent.com/d/")) {
      return url.split("=")[0] + "=w1000";
    }
    let idMatch = null;
    if (url.includes("/file/d/")) {
      idMatch = url.match(/\/file\/d\/([^/]+)/);
    } else if (url.includes("uc?export=view&id=")) {
      idMatch = url.match(/id=([^&]+)/);
    }
    const id = idMatch ? idMatch[1] : null;
    if (!id) return url;
    return `https://lh3.googleusercontent.com/d/${id}=w1000`;
  } catch {
    return url;
  }
};

// Primera letra mayúscula, resto minúsculas
const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// Generar ID personalizado con marca + nombre + fabrica + color
const generarId = (producto, variante) => {
  const base = `${producto.marca}-${producto.nombre}-${producto.fabrica}-${(variante.color || []).join("-")}`;
  return base.toLowerCase().replace(/\s+/g, "-");
};

const getImageId = (url) => {
  if (!url) return null;
  const match = url.match(/\/d\/([^/]+)=/);
  return match ? match[1] : null;
};

export default function MainForm() {
  const [form, setForm] = useState(inicializarForm());
  const [mantenerContacto, setMantenerContacto] = useState(false);
  const [nuevaVariante, setNuevaVariante] = useState(inicializarVariante());
  const [productos, setProductos] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [errores, setErrores] = useState({});
  const [varianteErrores, setVarianteErrores] = useState({});

  const darkMode = theme === "dark";

  function inicializarForm() {
    return {
      nombre: "",
      marca: "",
      tipo: "",
      suela: "",
      precioCaja: "",
      precioSinCaja: "",
      descripcion: "",
      fabrica: "",
      origen: "",
      colaboracion: false,
      cantidad: null,
      variantes: []
    };
  }

  function inicializarVariante() {
    return {
      color: [],
      imagenes: [""],
      videos: [],
      talles: [],
      distribucion: {}
    };
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.trimStart() : value
    }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleTalle = (num) => {
    setNuevaVariante((prev) => {
      const talles = prev.talles.includes(num)
        ? prev.talles.filter((t) => t !== num)
        : [...prev.talles, num];

      const nuevaDistribucion = { ...prev.distribucion };
      if (!talles.includes(num)) {
        delete nuevaDistribucion[num];
      }

      setVarianteErrores((prev) => ({ ...prev, talles: "" }));
      return { ...prev, talles, distribucion: nuevaDistribucion };
    });
  };

  const toggleColor = (color) => {
    setNuevaVariante((prev) => {
      const colores = prev.color.includes(color)
        ? prev.color.filter((c) => c !== color)
        : [...prev.color, color];
      setVarianteErrores((prev) => ({ ...prev, color: "" }));
      return { ...prev, color: colores };
    });
  };

  const agregarVariante = () => {
    const tieneImagenValida = (nuevaVariante.imagenes || []).some(
      (u) => u && u.trim() !== ""
    );
    const tieneVideoValido = (nuevaVariante.videos || []).some(
      (u) => u && u.trim() !== ""
    );

    const nuevosErrores = {};
    if (nuevaVariante.color.length === 0) {
      nuevosErrores.color = "Debes seleccionar al menos un color.";
    }
    if (!tieneImagenValida && !tieneVideoValido) {
      nuevosErrores.imagenes = "Debes agregar al menos una URL de imagen o video válida.";
    }
    if (nuevaVariante.talles.length === 0) {
      nuevosErrores.talles = "Debes seleccionar al menos un talle.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setVarianteErrores(nuevosErrores);
      return;
    }
    setVarianteErrores({});


    const imagenesConvertidas = (nuevaVariante.imagenes || [])
      .map((u) => (u || "").trim())
      .filter(Boolean)
      .map(convertirLinkDrive);

    const videosLimpios = (nuevaVariante.videos || [])
      .map((v) => (v || "").trim())
      .filter(Boolean);

    const idPorImagen = getImageId(imagenesConvertidas[0]) || generarId(form, nuevaVariante);

    const varianteConId = {
      ...nuevaVariante,
      id: idPorImagen,
      imagenes: imagenesConvertidas,
      videos: videosLimpios,
      distribucion: nuevaVariante.distribucion
    };

    setForm((prev) => ({
      ...prev,
      variantes: [...prev.variantes, varianteConId]
    }));

    setNuevaVariante(inicializarVariante());
  };

  const eliminarVariante = (id) => {
    setForm((prev) => ({
      ...prev,
      variantes: prev.variantes.filter((v) => v.id !== id)
    }));
  };

  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const guardarRespaldoLocal = (productos) => {
    const blob = new Blob([JSON.stringify(productos, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "productos.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!form.fabrica.trim()) {
      nuevosErrores.fabrica = "La fábrica es obligatoria.";
    }
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El modelo es obligatorio.";
    }
    if (!form.precioCaja) {
      nuevosErrores.precioCaja = "El precio con caja es obligatorio.";
    }
    if (form.variantes.length === 0) {
      nuevosErrores.variantes = "Debes agregar al menos una variante.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      const variantesConId = form.variantes.map((v) => {
        const firstImageId = getImageId(v.imagenes[0]) || crypto.randomUUID();
        const varianteId = `${form.fabrica.toLowerCase()}-${firstImageId.slice(-6)}`;
        return {
          ...v,
          id: varianteId,
          imagenes: (v.imagenes || []).map((img) => convertirLinkDrive(img)),
          videos: v.videos || []
        };
      });

      const idPrincipal = `${form.tipo}-${form.marca}-${form.nombre}`
        .toLowerCase()
        .replace(/\s+/g, "-");

      const nuevoProducto = {
        id: idPrincipal,
        fabrica: capitalizar(form.fabrica.trim()),
        marca: form.marca.trim(),
        nombre: form.nombre.trim(),
        precioCaja: parseInt(form.precioCaja) || 0,
        precioSinCaja: parseInt(form.precioSinCaja) || 0,
        tipo: form.tipo.trim(),
        cantidad: form.cantidad || null,
        suela: form.suela.trim(),
        origen: form.origen.trim(),
        colaboracion: form.colaboracion || false,
        descripcion: form.descripcion.trim(),
        variantes: variantesConId
      };

      const productosActualizados = [...productos, nuevoProducto];
      guardarRespaldoLocal(productosActualizados);

      setProductos(productosActualizados);
      setForm({
        ...inicializarForm(),
        fabrica: mantenerContacto ? form.fabrica : ""
      });
      setNuevaVariante(inicializarVariante());
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  return (
    <div className={`mainapp-container ${darkMode ? "dark" : "light"}`}>
      <div className="mainapp-wrapper">
        <div className="mainapp-header">
          <h2>📦 Cargar Zapatilla</h2>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="toggle-theme"
          >
            Cambiar a modo {darkMode ? "Claro" : "Oscuro"}
          </button>
        </div>

        <Formulario
          form={form}
          setForm={setForm}
          nuevaVariante={nuevaVariante}
          setNuevaVariante={setNuevaVariante}
          handleFormChange={handleFormChange}
          toggleColor={toggleColor}
          toggleTalle={toggleTalle}
          agregarVariante={agregarVariante}
          eliminarVariante={eliminarVariante}
          handleSubmit={handleSubmit}
          darkMode={darkMode}
          mantenerContacto={mantenerContacto}
          setMantenerContacto={setMantenerContacto}
          errores={errores}
          varianteErrores={varianteErrores}
        />

        <hr className="divider" />

        <ListaProductos
          productos={productos}
          eliminarProducto={eliminarProducto}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}