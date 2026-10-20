import axios from 'axios';

// Cliente HTTP do ViaCEP (API pública e gratuita de CEPs do Brasil)
const api = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
  timeout: 8000,
});

export default api;
