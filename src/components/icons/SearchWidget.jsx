import React from "react";
import { FaSearch } from "react-icons/fa";
import "./IconWidget.css";

const SearchWidget = () => {
  return (
    <div className="search-widget">
      <FaSearch className="search-icon" />
    </div>
  );
};

export default SearchWidget;
