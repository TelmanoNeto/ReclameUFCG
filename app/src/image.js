// As fotos vão para o Cloudinary (upload unsigned), não para o Firestore: um
// documento do Firestore cabe em 1 MB, e mesmo que coubesse, guardar imagem em
// base64 no banco encarece cada leitura do feed.
//
// A compressão continua acontecendo antes do upload — não é mais por causa da
// cota do localStorage, e sim porque o celular do testador sobe a foto pela
// rede da UFCG, e 4 MB por foto trava o envio.
const MAX_LADO = 1400;
const QUALIDADE = 0.78;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigurado = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Redimensiona e recomprime a imagem escolhida. Devolve um Blob JPEG.
 */
export function comprimirImagem(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Arquivo não é uma imagem'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Não foi possível abrir a imagem'));
      img.onload = () => {
        const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height));
        const w = Math.round(img.width * escala);
        const h = Math.round(img.height * escala);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível comprimir a imagem'))),
          'image/jpeg',
          QUALIDADE
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Prepara a foto para a tela de novo relato: um Blob para subir depois e uma
 * URL local só para a pré-visualização. Nada sobe enquanto a pessoa não publica
 * — assim uma foto escolhida e removida não vira lixo no Cloudinary.
 */
export async function prepararFoto(file) {
  const blob = await comprimirImagem(file);
  return { blob, preview: URL.createObjectURL(blob), label: '' };
}

export function descartarFoto(foto) {
  if (foto?.preview) URL.revokeObjectURL(foto.preview);
}

/**
 * Sobe um Blob para o Cloudinary com o preset unsigned e devolve a URL pública.
 */
export async function uploadFoto(blob) {
  if (!cloudinaryConfigurado) {
    throw new Error('O envio de fotos não está configurado neste ambiente.');
  }
  const form = new FormData();
  form.append('file', blob);
  form.append('upload_preset', UPLOAD_PRESET);

  const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form
  });
  if (!resp.ok) {
    throw new Error('Não foi possível enviar a foto. Verifique sua conexão e tente de novo.');
  }
  const dados = await resp.json();
  return dados.secure_url;
}

export async function uploadFotos(fotos) {
  const enviadas = await Promise.all((fotos || []).map((f) => uploadFoto(f.blob)));
  return enviadas.map((src, i) => ({ src, label: fotos[i].label || '' }));
}
