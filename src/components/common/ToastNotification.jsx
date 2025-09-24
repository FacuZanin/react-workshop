// src/components/ToastNotification.jsx
import React, { useEffect } from 'react';
import './ToastNotification.css';
import { useCarrito } from '../pages/CarritoContext';

const ToastNotification = ({ message, onDismiss }) => {
  useEffect(() => {
    // El toast se ocultará automáticamente después de 4 segundos
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [onDismiss]);

  return (
    <div className="toast-container">
      <div className="toast-content">
        <p className="toast-message">{message}</p>
        <button onClick={onDismiss} className="toast-button">
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;