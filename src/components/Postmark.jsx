// Carimbo postal: círculo com a cidade em volta, a data no meio e as linhas
// onduladas de "cancelamento" ao lado. Bate na etiqueta quando o endereço
// chega (a animação está no CSS).
export function Postmark({ city, state, date }) {
  // "19 OUT": dia e mês curto, sem o "de" (cabe no miolo do carimbo)
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  const day = `${String(date.getDate()).padStart(2, '0')} ${month}`;
  const year = date.getFullYear();
  const ring = `${city} · ${state} · ${city} · ${state} · `.toUpperCase();

  return (
    <svg className="postmark" viewBox="0 0 220 120" aria-hidden="true">
      <defs>
        <path id="postmark-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" />
      <circle cx="60" cy="60" r="33" />
      <text className="postmark__ring">
        <textPath href="#postmark-ring" textLength="270" lengthAdjust="spacingAndGlyphs">
          {ring}
        </textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" className="postmark__day">
        {day}
      </text>
      <text x="60" y="76" textAnchor="middle" className="postmark__year">
        {year}
      </text>
      {[34, 50, 66, 82].map((y) => (
        <path key={y} d={`M124 ${y} q12 -8 24 0 t24 0 t24 0 t24 0`} className="postmark__wave" />
      ))}
    </svg>
  );
}
