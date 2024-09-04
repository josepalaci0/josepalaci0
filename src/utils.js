/**
 * Genera un UUID versión 4
 * @returns {string} - UUID generado
 */
export function generateUUID() {
  return crypto.randomUUID();
}

/**
 * Hashea una contraseña utilizando el algoritmo SHA-256 y una sal aleatoria.
 * @param {string} password - La contraseña en texto plano.
 * @returns {Promise<{ hash: string, salt: string }>} - Un objeto con el hash en base64 y la sal en base64.
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();

  // Genera una sal aleatoria de 16 bytes
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Combina la contraseña y la sal
  const passwordBuffer = encoder.encode(password);
  const passwordWithSalt = new Uint8Array([...passwordBuffer, ...salt]);

  // Hashea utilizando SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordWithSalt);

  // Convierte el hash y la sal a cadenas en base64
  const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  const saltBase64 = btoa(String.fromCharCode(...salt));

  return { hash, salt: saltBase64 };
}

/**
 * Verifica si una contraseña en texto plano coincide con el hash almacenado.
 * @param {string} password - La contraseña en texto plano.
 * @param {string} hash - El hash almacenado en base64.
 * @param {string} salt - La sal almacenada en base64.
 * @returns {Promise<boolean>} - Verdadero si coincide, falso en caso contrario.
 */
export async function verifyPassword(password, hash, salt) {
  const encoder = new TextEncoder();

  const saltBytes = Uint8Array.from(atob(salt), c => c.charCodeAt(0));
  const passwordBuffer = encoder.encode(password);
  const passwordWithSalt = new Uint8Array([...passwordBuffer, ...saltBytes]);

  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordWithSalt);
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

  return hash === hashBase64;
}
