import { formatCep } from '../services/cepService';

// Últimos CEPs encontrados: um clique busca de novo
export function RecentCeps({ items, onPick, onClear }) {
  if (items.length === 0) return null;

  return (
    <section className="recent" aria-labelledby="recentes-titulo">
      <div className="recent__head">
        <h2 id="recentes-titulo" className="recent__title">
          Buscados por último
        </h2>
        <button type="button" className="recent__clear" onClick={onClear}>
          Limpar
        </button>
      </div>
      <ul className="recent__list">
        {items.map((item) => (
          <li key={item.cep}>
            <button type="button" className="recent__item" onClick={() => onPick(item.cep)}>
              <span className="recent__cep">{formatCep(item.cep)}</span>
              <span className="recent__place">
                {item.city} – {item.state}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
