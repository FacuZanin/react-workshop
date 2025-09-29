import { useState, useEffect } from "react";

/**
 * Hook personalizado para persistir estado en localStorage.
 * @param {string} key - La clave en localStorage.
 * @param {any} initialValue - Valor inicial si no hay nada guardado.
 * @returns {[any, function]} - Valor y función para actualizarlo.
 */
export function useLocalStorage(key, initialValue) {
  // Inicialización: leemos localStorage una sola vez
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Guardar cada vez que cambia
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error escribiendo localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
