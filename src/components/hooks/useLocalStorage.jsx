import { useState, useEffect } from 'react';

/**
 * Hook personalizado para persistir el estado con localStorage.
 * * @param {string} key - La clave en localStorage.
 * @param {any} defaultValue - El valor inicial a usar si no hay nada guardado.
 * @returns {[any, (value: any) => void]} - El valor y la función para establecerlo.
 */
export const useLocalStorage = (key, defaultValue) => {
  // 1. Inicialización (Lectura del valor)
  const [value, setValue] = useState(() => {
    // 💡 La inicialización se hace solo una vez para evitar re-ejecuciones innecesarias.
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const saved = window.localStorage.getItem(key);
      
      // Intentamos parsear el JSON
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (error) {
      // 🚨 Manejo de error si JSON.parse falla (datos corruptos)
      console.error(`Error al leer localStorage key “${key}”: `, error);
    }

    return defaultValue;
  });

  // 2. Persistencia (Escritura del valor)
  useEffect(() => {
    // 💡 Ejecución solo en el navegador
    if (typeof window === 'undefined') {
      return;
    }
    
    // Si el valor es una función, la ejecutamos para obtener el valor final (propio de React)
    const valueToStore = value instanceof Function ? value(value) : value;

    try {
      // 🚨 Manejo de error si localStorage falla (ej. cuota excedida)
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error al escribir en localStorage key “${key}”: `, error);
      // Opcional: Podrías revertir el estado o mostrar una notificación al usuario.
    }
  }, [key, value]);

  return [value, setValue];
};