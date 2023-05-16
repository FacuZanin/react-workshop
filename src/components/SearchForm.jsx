import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchForm.css';

const SearchForm = () => {
  return (
    <form role="search" action="/buscar" method="get" name="simpleSearch" className="search-form" >
      <div className="search-input" style={{ width: '400px' }}>
        <input
          className="form-control search-field"
          type="text"
          name="q"
          value=""
          placeholder="Buscar..."
          role="combobox"
          aria-describedby="search-assistive-text"
          aria-haspopup="listbox"
          aria-owns="search-results"
          aria-expanded="false"
          aria-autocomplete="list"
          aria-activedescendant=""
          aria-controls="search-results"
          aria-label="Enter Keyword or Item No."
          autoComplete="off"
        />
        <button type="reset" name="reset-button" className="fa fa-times reset-button d-none" aria-label="Clear search keywords"></button>
      </div>
      <button className="search-button">
        <FaSearch className="search-icon" />
      </button>
      <div className="suggestions-wrapper" data-url="/on/demandware.store/Sites-Dexter-Site/default/SearchServices-GetSuggestions?q="></div>
      <input type="hidden" value="null" name="lang" />
    </form>
  );
};

export default SearchForm;
