const KEY = 'reclameufcg_v1';

const DEFAULT_STATE = {
  users: [],
  sessionEmail: null,
  createdPosts: [],
  ups: {},
  upset: {},
  extraComments: {},
  deletedPosts: [],
  deletedComments: []
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage indisponível (ex.: modo privado) — segue apenas em memória.
  }
}
