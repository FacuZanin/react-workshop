import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./IconWidget.css";

const CartWidget = () => {

  return (
    <div className="cart-widget">
      <FaShoppingCart className="cart-icon" />
    </div>
  );
};

export default CartWidget;
