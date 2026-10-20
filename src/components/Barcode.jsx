// Código de barras no padrão POSTNET (o antigo código dos correios dos EUA):
// cada número vira 5 barras, sendo 2 altas. É decorativo, mas é "de verdade":
// as barras mudam conforme o CEP.
const POSTNET = {
  0: '11000', 1: '00011', 2: '00101', 3: '00110', 4: '01001',
  5: '01010', 6: '01100', 7: '10001', 8: '10010', 9: '10100',
};

const BAR_W = 2;
const GAP = 3;
const TALL = 22;
const SHORT = 9;

export function Barcode({ digits }) {
  // Dígito verificador: soma + verificador fecha múltiplo de 10
  const sum = [...digits].reduce((total, d) => total + Number(d), 0);
  const check = (10 - (sum % 10)) % 10;
  const pattern = '1' + [...digits, check].map((d) => POSTNET[d]).join('') + '1';
  const width = pattern.length * (BAR_W + GAP) - GAP;

  return (
    <svg className="barcode" viewBox={`0 0 ${width} ${TALL}`} aria-hidden="true" preserveAspectRatio="none">
      {[...pattern].map((bit, i) => (
        <rect
          key={i}
          x={i * (BAR_W + GAP)}
          y={bit === '1' ? 0 : TALL - SHORT}
          width={BAR_W}
          height={bit === '1' ? TALL : SHORT}
        />
      ))}
    </svg>
  );
}
