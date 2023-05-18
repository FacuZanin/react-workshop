import React from 'react';
import './Footer.css'; // Archivo de estilos CSS para el footer

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h2 className="footer-title">Alta Gama</h2>
            <p className="footer-description">Tienda de calzado e indumentaria</p>
          </div>
          <div className="footer-section">
            <h2 className="footer-title">Contacto</h2>
            <ul className="footer-links">
              <li><a href="#">Teléfono: (2473) 494750</a></li>
              <li><a href="#">Correo electrónico: info@AltaGama.com</a></li>
              <li><a href="#">Dirección: Colon Bs As </a></li>
              <li><a href="#">Enviar CV </a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h2 className="footer-title">Redes Sociales</h2>
            <ul className="footer-links">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-text">&copy; {new Date().getFullYear()} AltaGama. Todos los derechos reservados. Las fotos contenidas en este site, el logotipo y las marcas son propiedad de www.altagama.com.ar y/o de sus respectivos titulares. Está prohibida la reproducción total o parcial, sin la expresa autorización de la administradora de la tienda virtual.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
