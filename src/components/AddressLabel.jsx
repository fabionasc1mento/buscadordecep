import { useEffect, useState } from 'react';
import { addressToText, formatCep } from '../services/cepService';
import { Barcode } from './Barcode';
import { Postmark } from './Postmark';

// A etiqueta de envio. Sem endereço, ela aparece em branco (linhas vazias
// esperando o CEP); com endereço, recebe os dados e o carimbo.
export function AddressLabel({ address, loading }) {
  const [copied, setCopied] = useState(false);
  // Data do carimbo: o momento em que este endereço chegou
  const [stampedAt, setStampedAt] = useState(() => new Date());

  useEffect(() => {
    setStampedAt(new Date());
    setCopied(false);
  }, [address]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(addressToText(address));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!address) {
    return (
      <article className="label label--blank" data-loading={loading} aria-busy={loading}>
        <div className="label__stripes" aria-hidden="true" />
        <div className="label__body">
          <p className="label__to">Destinatário</p>
          <div className="label__blank-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="label__hint">{loading ? 'Consultando o endereço…' : 'O endereço aparece nesta etiqueta.'}</p>
        </div>
      </article>
    );
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressToText(address))}`;
  // CEP geral de cidade pequena não tem rua nem bairro
  const generalCep = !address.street;

  return (
    <article className="label" key={address.cep} aria-live="polite">
      <div className="label__stripes" aria-hidden="true" />
      <div className="label__body">
        <Postmark city={address.city} state={address.state} date={stampedAt} />

        <p className="label__to">Destinatário</p>
        <h2 className="label__street">{generalCep ? `CEP geral de ${address.city}` : address.street}</h2>
        <address className="label__lines">
          {address.complement && <span>{address.complement}</span>}
          {address.district && <span>{address.district}</span>}
          <span className="label__city">
            {address.city} – {address.state}
          </span>
        </address>

        <div className="label__cep">
          <span className="label__cep-number">{formatCep(address.cep)}</span>
          <Barcode digits={address.cep} />
        </div>

        <dl className="label__meta">
          <div>
            <dt>DDD</dt>
            <dd>{address.ddd || '–'}</dd>
          </div>
          <div>
            <dt>Código IBGE</dt>
            <dd>{address.ibge || '–'}</dd>
          </div>
        </dl>

        <div className="label__actions">
          <button type="button" className="button" onClick={copy}>
            {copied ? 'Endereço copiado' : 'Copiar endereço'}
          </button>
          <a className="button button--ghost" href={mapUrl} target="_blank" rel="noreferrer">
            Ver no mapa
          </a>
        </div>
      </div>
    </article>
  );
}
