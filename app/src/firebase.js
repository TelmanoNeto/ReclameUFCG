import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// As chaves vêm de app/.env.local (veja .env.local.example). Elas são públicas
// por natureza — quem protege os dados são as Security Rules, em firestore.rules.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/**
 * Sem as chaves o SDK do Firebase falha com um erro genérico em cada chamada,
 * e a tela fica em branco sem explicar por quê. Detectar aqui permite mostrar
 * um aviso claro em vez de deixar quem for rodar o projeto adivinhando.
 */
export const firebaseConfigurado = Boolean(config.apiKey && config.projectId && config.appId);

const app = firebaseConfigurado ? initializeApp(config) : null;

export const auth = app ? getAuth(app) : null;

// O e-mail de verificação sai no idioma pedido aqui. É o único controle que
// sobrou sobre esse texto: projetos novos do Firebase não têm permissão para
// editar os modelos de e-mail no console ("As atualizações de modelos de e-mail
// não estão disponíveis para este projeto"), então não dá para traduzir por lá.
// Sem esta linha o aluno recebe a mensagem em inglês.
if (auth) auth.languageCode = 'pt-BR';

export const db = app ? getFirestore(app) : null;
