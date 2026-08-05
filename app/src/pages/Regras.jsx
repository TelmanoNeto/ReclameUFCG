import { useNavigate } from 'react-router-dom';
import { REGRAS, DENUNCIA_MINIMO, DENUNCIA_PERCENTUAL } from '../data.js';

export default function Regras() {
  const navigate = useNavigate();
  const percentual = Math.round(DENUNCIA_PERCENTUAL * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>
      <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em' }}>Regras da comunidade</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
        O app existe para cobrar a universidade, não para expor pessoas. Todo relato aparece com o nome e o curso de
        quem publicou, então vale a pena ler estas quatro regras antes de escrever.
      </div>

      <div className="card" style={{ gap: 16 }}>
        {REGRAS.map((r, i) => (
          <div key={r.titulo} style={{ display: 'flex', gap: 12 }}>
            <div className="trend-rank">{String(i + 1).padStart(2, '0')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{r.titulo}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{r.texto}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mono">O que acontece quando um relato é denunciado</div>
      <div className="card" style={{ gap: 12, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
        <p style={{ margin: 0 }}>
          Qualquer aluno com conta pode denunciar um relato. Uma denúncia sozinha não faz nada — ela só é contada.
        </p>
        <p style={{ margin: 0 }}>
          O relato entra <strong>em revisão</strong> quando recebe <strong>{DENUNCIA_MINIMO} denúncias</strong> de
          pessoas diferentes ou, se já tiver muitos apoios, quando as denúncias chegam a <strong>{percentual}% dos
          apoios</strong> — o que for maior. Um relato com 300 apoios precisa de {Math.ceil(300 * DENUNCIA_PERCENTUAL)}{' '}
          denúncias, não de {DENUNCIA_MINIMO}. Isso evita que um grupo organizado derrube um relato verdadeiro só por
          incomodar.
        </p>
        <p style={{ margin: 0 }}>
          Exposição de dado pessoal de terceiro é a exceção: <strong>uma denúncia já coloca o relato em revisão</strong>,
          porque esse dano não dá para desfazer depois.
        </p>
        <p style={{ margin: 0 }}>
          Em revisão o relato continua visível e legível — ele só ganha um aviso e sai do “Em alta”. Quem publicou é
          avisado e pode corrigir. <strong>Nenhum relato é excluído automaticamente:</strong> a exclusão é sempre decisão
          da equipe do projeto, e só quando o relato quebra uma das quatro regras acima.
        </p>
      </div>
    </div>
  );
}
