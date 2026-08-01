import { useEffect, useState } from 'react';
import CategoryIllustration from './CategoryIllustration.jsx';

function Foto({ foto, catPadrao }) {
  if (foto.src) {
    return <img className="photo-cell-img" src={foto.src} alt={foto.label || 'foto do relato'} loading="lazy" />;
  }
  return <CategoryIllustration cat={foto.cat || catPadrao} />;
}

function Lightbox({ fotos, catPadrao, index, onClose, onIndex }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % fotos.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + fotos.length) % fotos.length);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, fotos.length, onClose, onIndex]);

  const foto = fotos[index];

  // O lightbox vive dentro do card clicável do feed — segurar o clique aqui
  // evita que fechar a foto acabe navegando para o relato.
  function fechar(e) {
    e.stopPropagation();
    onClose();
  }

  return (
    <div className="lightbox" onClick={fechar} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={fechar} aria-label="Fechar">✕</button>
      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <Foto foto={foto} catPadrao={catPadrao} />
      </div>
      {foto.label && <div className="lightbox-caption">{foto.label}</div>}
      {fotos.length > 1 && (
        <div className="lightbox-dots" onClick={(e) => e.stopPropagation()}>
          {fotos.map((_, i) => (
            <button
              key={i}
              className={`lightbox-dot ${i === index ? 'on' : ''}`}
              onClick={() => onIndex(i)}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PhotoGrid({ fotos, cat, detail = false }) {
  const [aberta, setAberta] = useState(-1);
  if (!fotos || fotos.length === 0) return null;

  const lista = fotos.slice(0, 4);

  return (
    <>
      <div
        className={`photo-grid n${lista.length} ${detail ? 'detail' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {lista.map((f, i) => (
          <button
            key={i}
            type="button"
            className="photo-cell"
            onClick={() => setAberta(i)}
            aria-label={f.label ? `Abrir foto: ${f.label}` : `Abrir foto ${i + 1}`}
          >
            <Foto foto={f} catPadrao={cat} />
            {f.label && lista.length <= 2 && <span className="photo-caption">{f.label}</span>}
          </button>
        ))}
      </div>
      {aberta >= 0 && (
        <Lightbox fotos={lista} catPadrao={cat} index={aberta} onClose={() => setAberta(-1)} onIndex={setAberta} />
      )}
    </>
  );
}
