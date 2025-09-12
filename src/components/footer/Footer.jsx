import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Información */}
          <div className="footer-section">
            <h2 className="footer-title">Carpincho Shoes</h2>
            <p className="footer-description">Tienda mayorista de calzado e indumentaria importada</p>
          </div>

          {/* Contacto */}
          <div className="footer-section">
            <h2 className="footer-title">Contacto</h2>
            <ul className="footer-links">
              <li><a href="tel:2473494750">Teléfono: (2473) 446533</a></li>
              <li><a href="https://www.google.com/maps?sca_esv=38b8b35f2fe0540c&output=search&q=rosario+santa+fe&source=lnms&fbs=AIIjpHz0NNiNr8DxUu4hofYE2E4KMzOejRixde3iSiGImqLd-kQxE9vJm4Fg3A4nu70kDLFka9ZEUbxSSO4NTQXXQNi_GX-xT721cUGpD7FxAc6otCHPNBIWUESXhFPXgSFiNT1VrG_epN7iWJ7Vn5Gpx5uLcFu84Cj1XHOlxX-Ij0m8MqTXRvm1Y17M3UGL7E547T-T029uO2q0ipREw7InJa-ZDxbJuQ&entry=mc&ved=1t:200715&ictx=111">Dirección: Rosario, Santa Fe</a></li>
              <li><a href="#">Dropshipping</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="footer-section">
            <h2 className="footer-title">Redes Sociales</h2>
            <ul className="footer-links">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Derechos reservados */}
        <div className="footer-bottom">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Carpincho Shoes. Todos los derechos reservados. 
            Las fotos contenidas en este sitio, el logotipo y las marcas son propiedad de sus respectivos titulares.
            Está prohibida la reproducción total o parcial sin autorización.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
