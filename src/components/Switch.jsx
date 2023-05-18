import React from 'react';
import './Switch.css';

const Switch = () => {
  return (
    <label tabIndex="0" className="switch">
      <input type="checkbox" />
      <span className="slider"></span>
      <span className="icon sun">🌞</span>
      <span className="icon moon">🌜</span>
    </label>
  );
}
export default Switch;
