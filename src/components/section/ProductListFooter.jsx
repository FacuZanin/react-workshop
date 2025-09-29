// src/components/section/ProductListFooter.jsx
import React from "react";
// Asumo que Pagination está en un archivo llamado Pagination.jsx en la misma carpeta
import Pagination from "./Pagination"; 

const ProductListFooter = ({
  currentPage,
  totalPages,
  onPageChange,
  productsPerPage,
  onProductsPerPageChange,
}) => {
  return (
    <div className="bottom-controls-container">
      {/* 🔢 Componente de Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* 📏 Control de productos por página */}
      <div className="products-per-page-control">
        <label htmlFor="products-per-page-select">MOSTRAR</label>
        <select
          id="products-per-page-select"
          value={productsPerPage}
          onChange={onProductsPerPageChange}
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={36}>36</option>
        </select>
        <label htmlFor="products-per-page-select">POR PÁGINA</label>
      </div>
    </div>
  );
};

export default ProductListFooter;