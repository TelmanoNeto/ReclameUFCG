# Backend do ReclameUFCG — o que existe e como ligar

O código do backend **está implementado**. O que falta é o que só pode ser feito
com uma conta Google no console: criar o projeto, colar as chaves e publicar as
regras. Este documento é o passo a passo disso, seguido do registro das decisões.

O protótipo antigo rodava inteiro no navegador (`localStorage`). Essa camada foi
removida — não existe mais nem dado de demonstração nem senha guardada no
cliente. Nada foi cadastrado com cartão de crédito.

---

## 1. Stack

| Necessidade | Serviço | Custo |
|---|---|---|
| Login, cadastro, verificação de e-mail | **Firebase Auth** | Grátis (plano Spark) |
| Relatos, comentários, apoios, denúncias | **Cloud Firestore** | Grátis (Spark) |
| Autorização (quem pode o quê) | **Security Rules** | Grátis |
| Publicação do site | Vercel (já configurada) | Grátis |
| Fotos dos relatos | **Cloudinary** (unsigned upload) | Grátis |

**Por que Cloudinary e não Firebase Storage:** o Cloud Storage passou a exigir o
plano Blaze em projetos novos, e o Blaze pede cartão. O Blaze provavelmente
custaria R$ 0 nesse volume, mas **não tem teto de gasto** — só alerta de
orçamento. Para um projeto de aluno, o risco de uma cobrança inesperada por bug
ou abuso não compensa.

**O que se perde por ficar no Spark** (nada crítico):

- *Blocking function* que rejeitaria o cadastro fora do domínio UFCG na hora — as
  Security Rules continuam bloqueando o acesso aos dados, então o efeito prático
  é o mesmo; só sobra uma conta órfã sem permissão de fazer nada.
- Limpeza automática de contas não verificadas — apagar na mão no console, uma
  vez por semestre.

---

## 2. Ligar o backend (o que falta fazer)

### 2.1 ⚠️ Primeiro de tudo: o teste que derruba o plano

**Enviar um e-mail de verificação para `telmano.leite.japiassu.neto@ccc.ufcg.edu.br`
e confirmar que ele chega.** Se o servidor da UFCG bloquear o remetente padrão do
Firebase (`noreply@<projeto>.firebaseapp.com`), ninguém consegue se cadastrar e o
app inteiro fica inutilizável. Esse teste custa 5 minutos e derruba o plano
inteiro se falhar — a saída seria configurar SMTP próprio nos templates.

Dá para fazer esse teste **antes** de mexer no app: console do Firebase →
Authentication → Users → adicionar usuário com esse e-mail → ⋮ → enviar link de
verificação. Se chegar, siga; se não chegar (nem no spam), pare aqui e resolva o
SMTP primeiro.

### 2.2 Passos

1. Criar projeto no [console do Firebase](https://console.firebase.google.com) —
   **manter no plano Spark**.
2. **Authentication → Sign-in method → E-mail/senha**: ativar.
3. **Idioma do e-mail:** nada a fazer no console. Projetos novos do Firebase
   **não podem editar os modelos de e-mail** ("As atualizações de modelos de
   e-mail não estão disponíveis para este projeto" — restrição antiphishing).
   O português vem de `auth.languageCode = 'pt-BR'` em
   [`app/src/firebase.js`](app/src/firebase.js), que faz o Firebase mandar a
   versão localizada. Sem essa linha, o e-mail chega em inglês.
4. **Firestore Database**: criar em modo produção. As regras deste repositório
   substituem o padrão no passo 7.
5. Criar conta no [Cloudinary](https://cloudinary.com) e gerar um **unsigned
   upload preset** (Settings → Upload → Upload presets → Signing Mode: Unsigned).
6. Chaves: copiar `app/.env.local.example` para `app/.env.local` e preencher.
   O `.gitignore` já ignora (`*.local`). Na Vercel, cadastrar as mesmas seis
   variáveis em Settings → Environment Variables.
7. Publicar regras e índices:

   ```
   npx firebase login
   npx firebase use --add            # escolher o projeto criado
   npx firebase deploy --only firestore:rules,firestore:indexes
   ```

   (Ou colar `firestore.rules` na aba Rules do console, se preferir pelo navegador.)
8. Virar administrador: no console, criar a coleção `admins` com um documento
   cujo **ID é o seu uid** (Authentication → Users mostra o uid). Qualquer campo
   serve; o que vale é o documento existir. Isso libera `/moderacao`.
9. `npm --prefix app run dev` e testar o cadastro com o e-mail institucional.

---

## 3. Modelo de dados

### `usuarios/{uid}`

Dados de perfil que o Auth não guarda. O documento usa o **uid como ID**.

```js
{
  nome: 'Fulana de Tal',
  email: 'fulana@ccc.ufcg.edu.br',   // duplicado do Auth, para exibição
  matricula: '123456789',
  telefone: '(83) 9 9999-9999',
  curso: 'Ciência da Computação',
  campus: 'Campina Grande',
  periodo: '2026.2',
  criadoEm: serverTimestamp()
}
```

Senha **não** entra aqui — fica no Auth. `app/src/senha.js` foi apagado.

### `relatos/{relatoId}`

```js
{
  autorUid: 'abc123',
  autorNome: 'Fulana de Tal · CC',   // desnormalizado, evita join na listagem
  cat: 'Banheiros',                  // uma de CATS
  campus: 'Campina Grande',
  curso: 'Ciência da Computação',
  local: 'CCT · Bloco CG · Térreo',
  localBase: 'CCT · Bloco CG',       // calculado no cliente, usado no agrupamento
  titulo: '...',
  resumo: '...',
  texto: '...',
  status: 'nao_resolvida',           // nao_resolvida | parcial | resolvida
  fotos: [{ src: 'https://res.cloudinary.com/...', label: '' }],
  criadoEm: serverTimestamp(),
  nApoios: 0,                        // espelhos, mantidos por escrita atômica
  nComentarios: 0,
  nDenuncias: 0,
  nDenunciasUrgentes: 0
}
```

`nComentarios` não estava no plano original e foi acrescentado: sem ele, mostrar
"💬 12" em cada card do feed exigiria carregar todos os comentários de todos os
relatos listados.

`nDenunciasUrgentes` também é novo, e resolve um conflito real: o motivo de cada
denúncia é privado (só quem denunciou lê), mas a tela precisa saber que o relato
entrou em revisão imediata por exposição de dado pessoal. A contagem de urgentes
é pública; o motivo individual, não.

### `relatos/{relatoId}/apoios/{uid}`

**Um documento por pessoa, com o uid como ID.** É isso que impede alguém de
apoiar 100 vezes — a regra só deixa criar o documento cujo ID é o próprio uid, e
`update` é proibido, então repetir a operação é recusado.

```js
{ uid: 'abc123', criadoEm: serverTimestamp() }
```

O campo `uid` repete o ID do documento porque a consulta "em quais relatos eu já
apoiei" é um `collectionGroup`, e esse tipo de consulta filtra por campo, não por
ID do documento.

> ❌ **Nunca** guardar apoios como um contador editável no relato. Qualquer
> pessoa conseguiria escrever `nApoios: 9999`.

### `relatos/{relatoId}/comentarios/{comentarioId}`

```js
{
  autorUid: 'abc123',
  autorNome: 'Fulana de Tal · CC',
  texto: '...',
  criadoEm: serverTimestamp(),
  relatoId: 'r1',                    // desnormalizado, para a aba do perfil
  relatoTitulo: 'Banheiro sem papel'
}
```

### `relatos/{relatoId}/denuncias/{uid}`

Mesmo padrão dos apoios: uid como ID garante uma denúncia por pessoa.

```js
{ uid: 'abc123', motivo: 'dado_pessoal', criadoEm: serverTimestamp() }
```

### `matriculas/{matricula}`

```js
{ uid: 'abc123', criadoEm: serverTimestamp() }
```

Reserva da matrícula, gravada no cadastro junto do perfil, na mesma escrita
atômica. A unicidade não vem de uma consulta "já existe alguém com essa
matrícula?" (que perde a corrida quando duas pessoas se cadastram ao mesmo
tempo) e sim do banco: as regras permitem `create` e proíbem `update`, então a
segunda tentativa é recusada. Quem consulta descobre no máximo que a matrícula
está tomada — não de quem ela é.

### `admins/{uid}`

Existir já é a permissão. Só o console escreve nessa coleção.

---

## 4. Security Rules

Estão em [`firestore.rules`](firestore.rules), comentadas. Os pontos que valem
destaque:

- **`alunoUFCG()`** — logado, com `email_verified == true` e domínio da UFCG. É a
  tradução da `isEmailUFCG()` do cliente, e é o que vale de fato.
- **Contadores** — `nApoios`, `nDenuncias` e `nComentarios` não podem ser
  escritos com valor arbitrário. Só andam de 1 em 1, e, no caso de apoio e
  denúncia, a regra usa `existsAfter()` para exigir que o documento da
  subcoleção exista depois da escrita. Ou seja: não dá para incrementar o
  contador sem registrar quem foi. O cliente faz as duas escritas num
  `writeBatch`, e a regra recusa uma sem a outra.
- **Edição pelo autor** — o autor edita texto e status, mas não encosta nos
  contadores nem transfere o relato para outra pessoa.
- **Denúncias** — cada pessoa só lê a própria; o administrador lê todas.
- **Perfis** — `usuarios/{uid}` é legível **só pelo dono**. As telas não
  precisam do perfil alheio: nome e curso de quem publicou vão desnormalizados
  no relato e no comentário. É assim que e-mail, telefone e matrícula deixam de
  ser dumpáveis por qualquer pessoa logada — o que a tela de cadastro promete.
- **Consultas por grupo de coleção** — os `match /{caminho=**}/…` no fim do
  arquivo existem porque `collectionGroup` não passa pelas regras aninhadas.

### ⚠️ O token do Auth fica velho

`email_verified` mora no ID token, que dura 1 hora. Depois que a pessoa clica no
link de verificação, o token **ainda diz `false`** e as regras continuam
bloqueando. Por isso `conferirVerificacao()` em `AppContext.jsx` faz:

```js
await auth.currentUser.reload();
await auth.currentUser.getIdToken(true);  // sem isso as rules ainda veem false
```

É o que o botão "Já confirmei, liberar minha conta" chama.

### Testes das regras

```
npm --prefix app run test:rules
```

Sobe o emulador do Firestore (precisa de Java, já instalado nesta máquina) e roda
`app/test/firestore-rules.test.js`. São **41 testes, todos passando**, cobrindo os
itens de segurança do checklist: conta sem verificar não publica nem comenta nem
apoia, e-mail fora da UFCG não escreve nada, aluno A não muda o status nem exclui
o relato do aluno B, contador não pode ser inflado sem o documento
correspondente, uma denúncia por pessoa, denúncia alheia não é legível, matrícula
não se repete, e ninguém vira administrador sozinho.

---

## 5. O que foi implementado

Todas as cinco etapas do plano original:

1. **Auth** — cadastro, login, logout, verificação de e-mail com reenvio e
   cooldown de 60s, bloqueio de publicar/comentar/apoiar enquanto não verificado.
   Tela `/verificar`, aviso no topo e no perfil.
2. **Relatos e comentários** — tudo no Firestore, feed com `onSnapshot`.
   `POSTS` e `USAR_DADOS_DEMO` apagados de `data.js`.
3. **Apoios, situação e agrupamento** — apoio como documento por pessoa, situação
   restrita ao autor, tópicos agrupados por categoria + campus + bloco.
4. **Denúncias e moderação** — denúncia por pessoa, limiar proporcional aos
   apoios (a lógica em `data.js` não mudou, só a origem dos números), e tela
   `/moderacao` restrita a quem tem documento em `admins`.
5. **Fotos** — compressão mantida, upload para o Cloudinary. As fotos só sobem
   quando a pessoa publica, para que uma foto escolhida e removida não vire
   arquivo órfão. O aviso de cota de armazenamento saiu junto com o
   `localStorage`.

### Onde o código se afasta do plano

- **Agrupamento em memória, não por consulta.** O plano previa `where` por
  `cat + campus + localBase` para montar "Em alta". Como o feed inteiro já está
  em memória (limite de 300 relatos), uma consulta por tópico só gastaria
  leitura para chegar ao mesmo resultado. O campo `localBase` **está** gravado no
  documento e o índice composto **está** em `firestore.indexes.json`: quando o
  volume passar de 300, é trocar a função `topicos` por uma query.
- **Comentários carregam por tela, não por listener global.** O hook
  `useComentarios(postId)` só assina enquanto a tela do relato está aberta; os
  cards do feed usam o espelho `nComentarios`. Um listener por relato do feed
  queimaria a cota de leitura.
- **Excluir relato não apaga a subcoleção.** O Firestore não faz exclusão em
  cascata sem Cloud Function, e Cloud Functions pedem Blaze. Os comentários e
  apoios do relato excluído ficam órfãos e invisíveis. Para um beta, tudo bem;
  limpar na mão no console se incomodar.

---

## 6. Arquivos

| Arquivo | O que aconteceu |
|---|---|
| `app/src/senha.js` | **Apagado** — a senha agora vive no Firebase Auth |
| `app/src/storage.js` | **Apagado** — não há mais estado no `localStorage` |
| `app/src/firebase.js` | **Novo** — inicialização e detecção de chave faltando |
| `app/src/AppContext.jsx` | Reescrito por dentro; a interface pública quase não mudou |
| `app/src/image.js` | Compressão + upload para o Cloudinary |
| `app/src/data.js` | Saíram `POSTS` e `USAR_DADOS_DEMO`; o resto permanece |
| `app/src/pages/VerificarEmail.jsx` | **Novo** |
| `app/src/pages/Moderacao.jsx` | **Novo** |
| `app/test/firestore-rules.test.js` | **Novo** — testes das regras no emulador |
| `firestore.rules`, `firestore.indexes.json`, `firebase.json` | **Novos**, na raiz |
| Telas (`pages/`, `components/`) | Ajustes pontuais — consomem o contexto |

Três mudanças de assinatura no contexto, por causa da ida ao servidor:

- `createPost` e `denunciar` agora são `async` (quem chama usa `await`);
- `deleteComment(comentario)` recebe o objeto, não só o id — precisa do
  `relatoId` para achar o documento na subcoleção;
- `commentsOf(id)` virou o hook `useComentarios(id)`, e `myComments` virou
  `useMeusComentarios(uid)`.

---

## 7. Armadilhas

- **Cota do Firestore:** 50 mil leituras/dia no Spark. O feed carrega no máximo
  300 relatos por listener (`LIMITE_FEED` em `AppContext.jsx`); passando disso,
  precisa de paginação.
- **Índices compostos:** os necessários estão em `firestore.indexes.json` e sobem
  no `deploy`. Se alguma consulta nova falhar, o erro no console traz o link que
  cria o índice. Só declare índices de **dois campos ou mais**: o Firestore já
  mantém índice automático de campo único (inclusive para `collectionGroup`), e
  declarar um deles faz o deploy falhar com `this index is not necessary`.
- **Deliverability:** testado em 01/08/2026 com
  `telmano.leite.japiassu.neto@ccc.ufcg.edu.br` — **o e-mail chega, mas cai no
  spam**. Não inviabiliza o plano, mas o convite aos testadores precisa avisar
  para olhar o spam e marcar "não é spam". A tela `/verificar` já traz esse
  aviso em destaque. A solução de verdade é pedir ao TI da UFCG para liberar
  `noreply@reclame-ufcg.firebaseapp.com` na allowlist; o plano B, se muita gente
  travar, é SMTP próprio (Brevo, Resend) — mas note que o painel de Templates
  está bloqueado neste projeto, então isso exigiria falar com o suporte.
- **Matrícula repetida:** garantida pela coleção `matriculas` (seção 3). Se a
  reserva falhar, a conta recém-criada no Auth é apagada em vez de ficar órfã
  segurando o e-mail.
- **LGPD:** a tela de cadastro agora diz o que é público (nome e curso) e o que
  não é (e-mail, telefone, matrícula).

---

## 8. Checklist antes do teste beta

- [ ] E-mail de verificação chega em `telmano.leite.japiassu.neto@ccc.ufcg.edu.br`
- [ ] `app/.env.local` preenchido e as mesmas variáveis cadastradas na Vercel
- [x] Security Rules escritas e testadas (`npm --prefix app run test:rules`)
- [ ] Security Rules **publicadas** no projeto (`firebase deploy`)
- [x] `POSTS` e `USAR_DADOS_DEMO` apagados
- [x] Conta sem verificar **não** consegue publicar, comentar nem apoiar
- [x] Aluno A **não** consegue mudar o status do relato do aluno B
- [ ] Upload de foto funcionando no celular (não só no desktop)
- [ ] Documento em `admins/{seu-uid}` criado e `/moderacao` abrindo- [ ] Lista de cursos conferida com o catálogo oficial da UFCG
- [x] Lista de blocos de **Campina Grande** conferida com a planta oficial
      (legenda do mapa da Prefeitura Universitária, 04/08/2026) — os demais
      campi continuam com a lista do protótipo
- [ ] Convite avisando para usar o **e-mail institucional** (metade dos
      voluntários deixou Gmail no formulário de validação)
