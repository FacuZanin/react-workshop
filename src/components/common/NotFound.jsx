import './NotFound.css';

const NotFound = ({ message }) => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h2>Lo sentimos... 😔</h2>
        <p>{message}</p>
        <p>Intenta con otra palabra clave o revisa la ortografía.</p>
      </div>
    </div>
  );
};

export default NotFound;