import React from "react";
import { Badge } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";

const HeartWidget = () => {

  return (
    <div className="heart-widget">
      <FaHeart className="heart-icon" />
    </div>
  );
};

export default HeartWidget;
