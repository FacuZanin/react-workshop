import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css"; // ✅ No olvides crear este archivo

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;

  // Genera un array con todos los números de página
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Lógica para mostrar solo un subconjunto de páginas alrededor de la página actual
  const getVisiblePages = () => {
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    // Si el rango es más pequeño de lo deseado, lo ajusta
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return pageNumbers.slice(start - 1, end);
  };

  return (
    <nav className="pagination">
      <button 
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Renderiza los números de página visibles */}
      {getVisiblePages().map((number) => (
        <button
          key={number}
          className={`pagination-btn ${currentPage === number ? "active" : ""}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button 
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;