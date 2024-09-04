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

export async function generateToken(userId, role) {
  const secret = 'your-secret-key'; // Clave secreta para firmar el token
  const header = {
    alg: 'HS256', // Algoritmo de firma
    typ: 'JWT', // Tipo de token
  };
  const payload = {
    userId, // ID del usuario
    role,   // Rol del usuario
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expira en 1 hora
  };

  // Función para codificar una cadena en base64 URL
  const encodeBase64Url = (str) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  // Codificar el header y el payload en base64 URL
  const headerBase64 = encodeBase64Url(JSON.stringify(header));
  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));

  // Generar la firma usando el algoritmo SHA-256
  const signature = await crypto.subtle
    .digest(
      'SHA-256',
      new TextEncoder().encode(`${headerBase64}.${payloadBase64}${secret}`)
    )
    .then((hashBuffer) => {
      return encodeBase64Url(String.fromCharCode(...new Uint8Array(hashBuffer)));
    });

  // Devolver el token completo
  return `${headerBase64}.${payloadBase64}.${signature}`;
}

export async function verifyToken(token) {
  const secret = 'your-secret-key';
  const [headerBase64, payloadBase64, signature] = token.split('.');

  const header = JSON.parse(atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/')));
  const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

  // Generar la firma esperada usando el mismo método que al generar el token
  const expectedSignature = crypto.createHmac('sha256', secret)
      .update(`${headerBase64}.${payloadBase64}`)
      .digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  // Verificar si la firma coincide
  if (signature !== expectedSignature) {
      return null; // Firma no coincide
  }

  // Verificar si el token ha expirado
  if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expirado
  }
  // Si todo es correcto, devolver el payload (los datos del token)
  return payload;
}


