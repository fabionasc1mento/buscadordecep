import { useCallback, useRef, useState } from 'react';
import { CepNotFoundError, fetchAddress } from '../services/cepService';

// Estado da busca: idle (nada buscado), loading, success, notFound ou error
export function useCepSearch() {
  const [state, setState] = useState({ status: 'idle', address: null, cep: '' });
  // Guarda a última busca: se o usuário buscar outro CEP antes da resposta
  // chegar, a resposta antiga é ignorada
  const lastRequest = useRef('');

  const search = useCallback(async (digits) => {
    lastRequest.current = digits;
    setState((prev) => ({ ...prev, status: 'loading', cep: digits }));

    try {
      const address = await fetchAddress(digits);
      if (lastRequest.current !== digits) return null;
      setState({ status: 'success', address, cep: digits });
      return address;
    } catch (error) {
      if (lastRequest.current !== digits) return null;
      const status = error instanceof CepNotFoundError ? 'notFound' : 'error';
      setState({ status, address: null, cep: digits });
      return null;
    }
  }, []);

  return { ...state, search };
}
