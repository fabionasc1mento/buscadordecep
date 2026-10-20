import { useRef, useState } from 'react';
import { CEP_LENGTH, onlyDigits } from '../services/cepService';

// Campo de CEP em 8 quadradinhos, como nos formulários de correio.
// Por baixo é um <input> normal (transparente, por cima dos quadrados):
// teclado, colar e leitor de tela funcionam como em qualquer campo.
export function CepInput({ value, onChange, onComplete, invalid }) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (event) => {
    const digits = onlyDigits(event.target.value);
    onChange(digits);
    if (digits.length === CEP_LENGTH && digits !== value) onComplete(digits);
  };

  const boxes = Array.from({ length: CEP_LENGTH }, (_, i) => value[i] ?? '');
  // Quadrado onde o próximo número vai entrar
  const current = Math.min(value.length, CEP_LENGTH - 1);

  return (
    <div className="cep-input" data-invalid={invalid} onClick={() => inputRef.current?.focus()}>
      <label htmlFor="cep" className="cep-input__label">
        CEP de destino
      </label>
      <div className="cep-input__boxes" aria-hidden="true">
        {boxes.map((digit, i) => (
          <span key={i} className="cep-input__group">
            {i === 5 && <span className="cep-input__dash">–</span>}
            <span className="cep-input__box" data-current={focused && i === current} data-filled={digit !== ''}>
              {digit}
            </span>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        id="cep"
        className="cep-input__field"
        type="text"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={9}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-describedby="cep-ajuda"
        aria-invalid={invalid}
        autoFocus
      />
    </div>
  );
}
