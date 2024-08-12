import React from 'react';
import '../styles.css';

const Square = ({ value, onSquareClick }) => {
  return (
    <button 
      className="square" 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

export default Square;