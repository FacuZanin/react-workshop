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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
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