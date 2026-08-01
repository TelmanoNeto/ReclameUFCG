# Prompt — Protótipo do ReclameUFCG

Prototipe uma plataforma web chamada **ReclameUFCG**: uma vitrine pública, no
estilo de rede social, onde estudantes universitários publicam reclamações
sobre infraestrutura e serviços da universidade (banheiros, ar-condicionado,
falta de RU/cantina, salas, acessibilidade, etc.), e qualquer pessoa pode
navegar, curtir e comentar esses relatos.

## 1. Contexto do produto

Alunos convivem com problemas recorrentes de infraestrutura e não têm um
canal simples e visível para relatá-los. O ReclameUFCG não é um sistema de
tickets institucional — é uma **vitrine pública**: o valor vem da exposição
e do engajamento coletivo (apoios/comentários), não de um fluxo de
atendimento com a administração da universidade.

Tom visual: acolhedor, direto e um pouco "campus/estudantil" — pense num
misto de feed de rede social (estilo Twitter/X ou Reddit) com identidade de
universidade pública. Precisa funcionar bem em mobile (a maioria dos alunos
vai acessar pelo celular).

## 2. Regras que moldam a navegação (importante para o fluxo)

- **Ninguém precisa de login para navegar.** Visitante anônimo pode ver o
  feed, a timeline, os trending topics, buscar e filtrar por categoria,
  campus e curso.
- **Login só é exigido para 3 ações:** publicar uma reclamação, comentar e
  dar apoio ("up"). Ao tentar qualquer uma dessas sem estar logado, mostrar
  um prompt de login/cadastro.
- **Cadastro aceita qualquer e-mail** (não precisa ser institucional) e
  coleta: nome completo, e-mail, senha, telefone, matrícula, curso e
  campus/período.
- **Publicação pode ser anônima**: ao criar a reclamação, o autor escolhe se
  seu nome aparece publicamente ou se é exibido como "Anônimo".
- **Não existe painel de administração institucional.** Não prototipe telas
  de coordenação, setor ou reitoria, nem status de "resolvido" atribuído
  pela universidade. A única forma de "resposta" é o engajamento da
  comunidade (comentários e apoios).

## 3. Telas para prototipar

1. **Feed / Timeline (home pública)**
   - Scroll infinito, estilo rede social, com as reclamações mais recentes.
   - Cada card mostra: foto (se houver), categoria (badge/tag), campus e
     local, trecho do texto (ou resumo gerado por IA se o texto for longo),
     nome do autor ou "Anônimo", contador de apoios e de comentários.
   - Filtros no topo por categoria, campus e curso, e uma barra de busca.
   - Acessível sem login.

2. **Trending Topics**
   - Seção de destaque (pode ser uma aba do feed ou um bloco lateral/topo)
     com as reclamações/tópicos com mais apoios e comentários recentes
     (ex.: últimas 72h/7 dias).
   - Cada item do trending traz uma linha de resumo gerada por IA explicando
     por que está em alta (ex.: "12 relatos sobre falta de papel higiênico
     no CCBS nesta semana").
   - Indicar visualmente quando vários relatos foram agrupados no mesmo
     tópico (ex.: "12 relatos semelhantes").

3. **Detalhe da reclamação**
   - Texto completo, foto ampliada, categoria, localização, autor
     (ou Anônimo), contador de apoios, botão de apoiar (exige login) e
     lista de comentários com campo para novo comentário (exige login).
   - Se a reclamação faz parte de um agrupamento (duplicatas), mostrar link
     para os relatos semelhantes.
   - Opção de "denunciar" o conteúdo, visível a qualquer usuário logado.

4. **Criar reclamação** (exige login)
   - Campo de texto livre, upload de foto, seleção de categoria (com
     sugestão automática da IA a partir do texto digitado) e localização
     (campus → centro/bloco → sala, quando aplicável).
   - Toggle "publicar como anônimo".
   - Um modo assistido opcional: chat guiado onde a IA transforma um relato
     curto em uma descrição mais completa, perguntando local, frequência e
     impacto.

5. **Cadastro e Login**
   - Cadastro: nome completo, e-mail (qualquer provedor), senha, telefone,
     matrícula, curso, campus/período.
   - Login simples por e-mail e senha.
   - Ambos os formulários devem deixar claro que são só para quem quer
     publicar/interagir — não são obrigatórios para navegar no site.

6. **Perfil do usuário**
   - Lista das reclamações e comentários publicados pelo usuário logado,
     com opção de editar ou excluir cada um.

## 4. O que NÃO incluir

- Nenhuma tela de administração/moderação para coordenação, setor ou
  reitoria da universidade.
- Nenhum status formal de "resolvido/em andamento" atribuído pela
  universidade — só o engajamento da comunidade (apoios/comentários).
- Nenhuma exigência de e-mail institucional para cadastro/login.

## 5. Entregável esperado

Um protótipo navegável (alta fidelidade) das 6 telas acima, com estado
"visitante não logado" e "usuário logado" quando a diferença for relevante
(principalmente no feed, no detalhe da reclamação e ao tentar publicar
comentar/apoiar), priorizando o layout mobile.
