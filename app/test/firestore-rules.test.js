/**
 * Testes das Security Rules (firestore.rules) contra o emulador do Firestore.
 *
 * Estas regras são a única coisa que separa o app de qualquer pessoa mandando
 * escrita direto para a API do Firestore. Testá-las é o equivalente a testar a
 * fechadura — o resto do código é decoração de porta.
 *
 * Como rodar (na raiz do repositório):
 *   npm --prefix app run test:rules
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc, writeBatch } from 'firebase/firestore';

const RULES = fileURLToPath(new URL('../../firestore.rules', import.meta.url));

let testEnv;

// Perfis usados nos testes.
const ALUNO = { uid: 'aluno-a', email: 'fulana@ccc.ufcg.edu.br', email_verified: true };
const OUTRO_ALUNO = { uid: 'aluno-b', email: 'sicrano@ee.ufcg.edu.br', email_verified: true };
const SEM_VERIFICAR = { uid: 'aluno-c', email: 'beltrano@ccc.ufcg.edu.br', email_verified: false };
const DE_FORA = { uid: 'gmail-1', email: 'qualquer@gmail.com', email_verified: true };
const ADMIN = { uid: 'admin-1', email: 'admin@ufcg.edu.br', email_verified: true };

function ctx({ uid, email, email_verified }) {
  return testEnv.authenticatedContext(uid, { email, email_verified }).firestore();
}
function anonimo() {
  return testEnv.unauthenticatedContext().firestore();
}

const RELATO_BASE = {
  autorUid: ALUNO.uid,
  autorNome: 'Fulana de Tal · CC',
  cat: 'Banheiros',
  campus: 'Campina Grande',
  curso: 'Ciência da Computação',
  local: 'CCT · Bloco CG · Térreo',
  localBase: 'CCT · Bloco CG',
  titulo: 'Banheiro sem papel',
  resumo: 'Sem papel desde segunda',
  texto: 'Sem papel desde segunda.',
  status: 'nao_resolvida',
  fotos: [],
  criadoEm: new Date(),
  nApoios: 0,
  nComentarios: 0,
  nDenuncias: 0,
  nDenunciasUrgentes: 0
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-reclameufcg',
    firestore: { rules: readFileSync(RULES, 'utf8'), host: '127.0.0.1', port: 8080 }
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (c) => {
    const db = c.firestore();
    await setDoc(doc(db, 'relatos', 'r1'), RELATO_BASE);
    await setDoc(doc(db, 'admins', ADMIN.uid), { desde: new Date() });
  });
});

describe('leitura', () => {
  it('qualquer pessoa lê o feed, sem conta', async () => {
    await assertSucceeds(getDoc(doc(anonimo(), 'relatos', 'r1')));
  });
});

describe('publicar relato', () => {
  const novo = (autorUid) => ({ ...RELATO_BASE, autorUid });

  it('aluno da UFCG com e-mail confirmado publica', async () => {
    await assertSucceeds(setDoc(doc(ctx(ALUNO), 'relatos', 'novo'), novo(ALUNO.uid)));
  });

  it('conta sem e-mail confirmado NÃO publica', async () => {
    await assertFails(setDoc(doc(ctx(SEM_VERIFICAR), 'relatos', 'novo'), novo(SEM_VERIFICAR.uid)));
  });

  it('e-mail fora da UFCG NÃO publica, mesmo confirmado', async () => {
    await assertFails(setDoc(doc(ctx(DE_FORA), 'relatos', 'novo'), novo(DE_FORA.uid)));
  });

  it('sem conta NÃO publica', async () => {
    await assertFails(setDoc(doc(anonimo(), 'relatos', 'novo'), novo('qualquer')));
  });

  it('não dá para publicar em nome de outra pessoa', async () => {
    await assertFails(setDoc(doc(ctx(ALUNO), 'relatos', 'novo'), novo(OUTRO_ALUNO.uid)));
  });

  it('não dá para nascer com contador inflado', async () => {
    await assertFails(
      setDoc(doc(ctx(ALUNO), 'relatos', 'novo'), { ...novo(ALUNO.uid), nApoios: 9999 })
    );
  });
});

describe('editar e excluir relato', () => {
  it('o autor edita o próprio texto', async () => {
    await assertSucceeds(updateDoc(doc(ctx(ALUNO), 'relatos', 'r1'), { texto: 'outro texto' }));
  });

  it('aluno B NÃO muda o status do relato do aluno A', async () => {
    await assertFails(updateDoc(doc(ctx(OUTRO_ALUNO), 'relatos', 'r1'), { status: 'resolvida' }));
  });

  it('o autor NÃO escreve nApoios direto', async () => {
    await assertFails(updateDoc(doc(ctx(ALUNO), 'relatos', 'r1'), { nApoios: 9999 }));
  });

  it('o autor NÃO transfere o relato para outra pessoa', async () => {
    await assertFails(updateDoc(doc(ctx(ALUNO), 'relatos', 'r1'), { autorUid: OUTRO_ALUNO.uid }));
  });

  it('aluno B NÃO exclui o relato do aluno A', async () => {
    await assertFails(deleteDoc(doc(ctx(OUTRO_ALUNO), 'relatos', 'r1')));
  });

  it('o autor exclui o próprio relato', async () => {
    await assertSucceeds(deleteDoc(doc(ctx(ALUNO), 'relatos', 'r1')));
  });

  it('o administrador exclui relato de qualquer pessoa', async () => {
    await assertSucceeds(deleteDoc(doc(ctx(ADMIN), 'relatos', 'r1')));
  });
});

describe('apoios', () => {
  function apoiar(db, uid) {
    const batch = writeBatch(db);
    batch.set(doc(db, 'relatos', 'r1', 'apoios', uid), { uid, criadoEm: new Date() });
    batch.update(doc(db, 'relatos', 'r1'), { nApoios: increment(1) });
    return batch.commit();
  }

  it('aluno verificado apoia', async () => {
    await assertSucceeds(apoiar(ctx(ALUNO), ALUNO.uid));
  });

  it('conta sem e-mail confirmado NÃO apoia', async () => {
    await assertFails(apoiar(ctx(SEM_VERIFICAR), SEM_VERIFICAR.uid));
  });

  it('apoiar de novo é recusado — o documento do apoio já existe', async () => {
    const db = ctx(ALUNO);
    await assertSucceeds(apoiar(db, ALUNO.uid));
    await assertFails(apoiar(db, ALUNO.uid));
  });

  it('NÃO dá para incrementar o contador sem criar o apoio', async () => {
    await assertFails(updateDoc(doc(ctx(ALUNO), 'relatos', 'r1'), { nApoios: increment(1) }));
  });

  it('NÃO dá para apoiar em nome de outra pessoa', async () => {
    await assertFails(
      setDoc(doc(ctx(ALUNO), 'relatos', 'r1', 'apoios', OUTRO_ALUNO.uid), { uid: OUTRO_ALUNO.uid })
    );
  });

  it('desapoiar exige apagar o apoio junto', async () => {
    const db = ctx(ALUNO);
    await apoiar(db, ALUNO.uid);
    const batch = writeBatch(db);
    batch.delete(doc(db, 'relatos', 'r1', 'apoios', ALUNO.uid));
    batch.update(doc(db, 'relatos', 'r1'), { nApoios: increment(-1) });
    await assertSucceeds(batch.commit());
  });
});

describe('comentários', () => {
  function comentar(db, autorUid, id = 'c1') {
    const batch = writeBatch(db);
    batch.set(doc(db, 'relatos', 'r1', 'comentarios', id), {
      autorUid,
      autorNome: 'Alguém · CC',
      texto: 'oi',
      criadoEm: new Date(),
      relatoId: 'r1',
      relatoTitulo: 'Banheiro sem papel'
    });
    batch.update(doc(db, 'relatos', 'r1'), { nComentarios: increment(1) });
    return batch.commit();
  }

  it('aluno verificado comenta', async () => {
    await assertSucceeds(comentar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid));
  });

  it('conta sem e-mail confirmado NÃO comenta', async () => {
    await assertFails(comentar(ctx(SEM_VERIFICAR), SEM_VERIFICAR.uid));
  });

  it('NÃO dá para comentar em nome de outra pessoa', async () => {
    await assertFails(comentar(ctx(ALUNO), OUTRO_ALUNO.uid));
  });

  it('comentário é público', async () => {
    await comentar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid);
    await assertSucceeds(getDoc(doc(anonimo(), 'relatos', 'r1', 'comentarios', 'c1')));
  });

  it('quem comentou apaga o próprio comentário', async () => {
    const db = ctx(OUTRO_ALUNO);
    await comentar(db, OUTRO_ALUNO.uid);
    const batch = writeBatch(db);
    batch.delete(doc(db, 'relatos', 'r1', 'comentarios', 'c1'));
    batch.update(doc(db, 'relatos', 'r1'), { nComentarios: increment(-1) });
    await assertSucceeds(batch.commit());
  });

  it('ninguém apaga comentário alheio', async () => {
    await comentar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid);
    await assertFails(deleteDoc(doc(ctx(ALUNO), 'relatos', 'r1', 'comentarios', 'c1')));
  });
});

describe('denúncias', () => {
  function denunciar(db, uid, motivo = 'ofensa', urgente = false) {
    const batch = writeBatch(db);
    batch.set(doc(db, 'relatos', 'r1', 'denuncias', uid), { uid, motivo, criadoEm: new Date() });
    batch.update(doc(db, 'relatos', 'r1'), {
      nDenuncias: increment(1),
      ...(urgente ? { nDenunciasUrgentes: increment(1) } : {})
    });
    return batch.commit();
  }

  it('aluno verificado denuncia', async () => {
    await assertSucceeds(denunciar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid));
  });

  it('denúncia urgente marca o contador público', async () => {
    await assertSucceeds(denunciar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid, 'dado_pessoal', true));
  });

  it('uma denúncia por pessoa — a segunda é recusada', async () => {
    const db = ctx(OUTRO_ALUNO);
    await assertSucceeds(denunciar(db, OUTRO_ALUNO.uid));
    await assertFails(denunciar(db, OUTRO_ALUNO.uid));
  });

  it('NÃO dá para inflar nDenuncias sem denunciar', async () => {
    await assertFails(updateDoc(doc(ctx(ALUNO), 'relatos', 'r1'), { nDenuncias: increment(1) }));
  });

  it('ninguém lê a denúncia de outra pessoa', async () => {
    await denunciar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid);
    await assertFails(getDoc(doc(ctx(ALUNO), 'relatos', 'r1', 'denuncias', OUTRO_ALUNO.uid)));
  });

  it('quem denunciou lê a própria denúncia', async () => {
    const db = ctx(OUTRO_ALUNO);
    await denunciar(db, OUTRO_ALUNO.uid);
    await assertSucceeds(getDoc(doc(db, 'relatos', 'r1', 'denuncias', OUTRO_ALUNO.uid)));
  });

  it('o administrador lê as denúncias, para poder moderar', async () => {
    await denunciar(ctx(OUTRO_ALUNO), OUTRO_ALUNO.uid);
    await assertSucceeds(getDoc(doc(ctx(ADMIN), 'relatos', 'r1', 'denuncias', OUTRO_ALUNO.uid)));
  });
});

describe('perfis', () => {
  it('a pessoa cria o próprio perfil', async () => {
    await assertSucceeds(
      setDoc(doc(ctx(ALUNO), 'usuarios', ALUNO.uid), { nome: 'Fulana', matricula: '123456789' })
    );
  });

  it('ninguém escreve no perfil de outra pessoa', async () => {
    await assertFails(setDoc(doc(ctx(ALUNO), 'usuarios', OUTRO_ALUNO.uid), { nome: 'Invasora' }));
  });

  it('perfil não é legível sem conta', async () => {
    await testEnv.withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), 'usuarios', ALUNO.uid), { nome: 'Fulana' });
    });
    await assertFails(getDoc(doc(anonimo(), 'usuarios', ALUNO.uid)));
  });

  it('e-mail, telefone e matrícula não vazam para outro aluno', async () => {
    await testEnv.withSecurityRulesDisabled(async (c) => {
      await setDoc(doc(c.firestore(), 'usuarios', ALUNO.uid), {
        nome: 'Fulana',
        email: 'fulana@ccc.ufcg.edu.br',
        telefone: '(83) 9 9999-9999',
        matricula: '123456789'
      });
    });
    await assertFails(getDoc(doc(ctx(OUTRO_ALUNO), 'usuarios', ALUNO.uid)));
  });

  it('ninguém vira administrador sozinho', async () => {
    await assertFails(setDoc(doc(ctx(ALUNO), 'admins', ALUNO.uid), { desde: new Date() }));
  });
});

describe('matrícula única', () => {
  it('a matrícula é reservada no cadastro', async () => {
    await assertSucceeds(
      setDoc(doc(ctx(ALUNO), 'matriculas', '123456789'), { uid: ALUNO.uid, criadoEm: new Date() })
    );
  });

  it('outra pessoa NÃO registra a mesma matrícula', async () => {
    await setDoc(doc(ctx(ALUNO), 'matriculas', '123456789'), { uid: ALUNO.uid, criadoEm: new Date() });
    await assertFails(
      setDoc(doc(ctx(OUTRO_ALUNO), 'matriculas', '123456789'), { uid: OUTRO_ALUNO.uid, criadoEm: new Date() })
    );
  });

  it('não dá para reservar matrícula em nome de outra pessoa', async () => {
    await assertFails(
      setDoc(doc(ctx(ALUNO), 'matriculas', '987654321'), { uid: OUTRO_ALUNO.uid, criadoEm: new Date() })
    );
  });
});
