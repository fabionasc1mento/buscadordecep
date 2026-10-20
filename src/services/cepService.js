import api from './api';

// Regras do CEP e acesso à API ficam aqui. Os componentes não sabem que
// existe ViaCEP: só pedem um endereço e recebem um objeto já organizado.

export const CEP_LENGTH = 8;

// "01310-100" ou "01310 100" -> "01310100"
export function onlyDigits(value) {
  return String(value).replace(/\D/g, '').slice(0, CEP_LENGTH);
}

export function isValidCep(digits) {
  return digits.length === CEP_LENGTH;
}

// "01310100" -> "01310-100"
export function formatCep(digits) {
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

// Erro próprio para "CEP não existe", diferente de "falhou a conexão"
export class CepNotFoundError extends Error {
  constructor(cep) {
    super(`CEP ${formatCep(cep)} não encontrado`);
    this.name = 'CepNotFoundError';
  }
}

export async function fetchAddress(digits) {
  const { data } = await api.get(`${digits}/json/`);

  // O ViaCEP responde 200 com { erro: true } quando o CEP não existe
  if (data.erro) throw new CepNotFoundError(digits);

  return {
    cep: onlyDigits(data.cep),
    street: data.logradouro,
    complement: data.complemento,
    district: data.bairro,
    city: data.localidade,
    state: data.uf,
    ddd: data.ddd,
    ibge: data.ibge,
  };
}

// Endereço em uma linha, para copiar ou buscar no mapa
export function addressToText(address) {
  const street = [address.street, address.complement].filter(Boolean).join(', ');
  return [street, address.district, `${address.city} - ${address.state}`, formatCep(address.cep)]
    .filter(Boolean)
    .join(', ');
}
