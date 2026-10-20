import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'buscador-cep:recentes';
const MAX_ITEMS = 5;

function load() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Últimos CEPs encontrados, salvos no navegador
export function useRecentCeps() {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // navegador sem localStorage (aba anônima, por exemplo): só não salva
    }
  }, [items]);

  const add = useCallback((address) => {
    setItems((prev) => {
      const item = { cep: address.cep, city: address.city, state: address.state };
      return [item, ...prev.filter((entry) => entry.cep !== item.cep)].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, clear };
}
