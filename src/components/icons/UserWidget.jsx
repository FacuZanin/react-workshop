import React from "react";
import { FaUser } from "react-icons/fa";
import "./IconWidget.css";

const UserWidget = () => {

  return (
    <div className="user-widget">
      <FaUser className="user-icon" />
    </div>
  );
};

export default UserWidget;
