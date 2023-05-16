import React from "react";

const ItemListContainer = ({ greeting }) => {
  return (
    <div className="item-list-container">
      <h2>{greeting}</h2>
      {/* Aquí puedes agregar el contenido adicional */}
    </div>
  );
};

export default ItemListContainer;
