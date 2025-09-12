// src/layouts/AuthLayout.jsx
import Carpincho from "../assets/images/carpincho.png"; // 👈 tu logo

function AuthLayout({ children }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {/* Logo arriba */}
      <div className="mb-4 text-center">
        <img
          src={Carpincho}
          alt="Logo"
          style={{ maxWidth: "150px" }}
          className="img-fluid"
        />
        <h2 className="mt-3">Bienvenido</h2>
      </div>

      {/* Contenido (login, registro, etc.) */}
      <div className="p-4 bg-white rounded shadow" style={{ minWidth: "350px" }}>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
