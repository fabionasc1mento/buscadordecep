import { useState } from 'react';
import './style.css';
import { AddressLabel } from './components/AddressLabel';
import { CepInput } from './components/CepInput';
import { RecentCeps } from './components/RecentCeps';
import { useCepSearch } from './hooks/useCepSearch';
import { useRecentCeps } from './hooks/useRecentCeps';
import { formatCep, isValidCep } from './services/cepService';

function App() {
  const [digits, setDigits] = useState('');
  const [touched, setTouched] = useState(false);
  const { status, address, cep, search } = useCepSearch();
  const recent = useRecentCeps();

  const runSearch = async (value) => {
    setTouched(true);
    if (!isValidCep(value)) return;
    const found = await search(value);
    if (found) recent.add(found);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(digits);
  };

  const pickRecent = (value) => {
    setDigits(value);
    runSearch(value);
  };

  // Mensagem embaixo do campo: ajuda, erro de digitação ou erro da busca
  const incomplete = touched && !isValidCep(digits) && status !== 'loading';
  let message = 'Digite os 8 números. A busca começa sozinha.';
  let tone = 'help';
  if (incomplete) {
    message = `Faltam ${8 - digits.length} ${8 - digits.length === 1 ? 'número' : 'números'} para completar o CEP.`;
    tone = 'error';
  } else if (status === 'notFound') {
    message = `O CEP ${formatCep(cep)} não existe. Confira os números e tente de novo.`;
    tone = 'error';
  } else if (status === 'error') {
    message = 'Não deu para consultar agora. Verifique sua conexão e busque de novo.';
    tone = 'error';
  }

  return (
    <div className="page">
      <div className="airmail" aria-hidden="true" />

      <main className="sheet">
        <header className="masthead">
          <h1 className="masthead__title">
            <span>Buscador</span> <span>de CEP</span>
          </h1>
          <p className="masthead__lede">Digite um CEP e receba o endereço completo numa etiqueta pronta para copiar.</p>
        </header>

        <form className="search" onSubmit={handleSubmit} noValidate>
          <CepInput
            value={digits}
            onChange={(value) => {
              setDigits(value);
              if (touched && isValidCep(value)) setTouched(false);
            }}
            onComplete={runSearch}
            invalid={tone === 'error'}
          />
          <button className="button button--stamp" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Buscando…' : 'Buscar endereço'}
          </button>
          <p id="cep-ajuda" className="search__message" data-tone={tone} role={tone === 'error' ? 'alert' : undefined}>
            {message}
          </p>
        </form>

        <AddressLabel address={status === 'success' ? address : null} loading={status === 'loading'} />

        <RecentCeps items={recent.items} onPick={pickRecent} onClear={recent.clear} />
      </main>

      <footer className="colophon">
        Endereços consultados na API pública do{' '}
        <a href="https://viacep.com.br" target="_blank" rel="noreferrer">
          ViaCEP
        </a>
        . Feito por{' '}
        <a href="https://fabionasc1mento.github.io" target="_blank" rel="noreferrer">
          Fábio Tarcio
        </a>
        .
      </footer>
    </div>
  );
}

export default App;
