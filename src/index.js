import { generateUUID, hashPassword, verifyPassword } from './utils.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === '/api/users' && request.method === 'POST') {
        return await createUser(request, env);
      } else if (pathname === '/api/users/login' && request.method === 'POST') {
        return await loginUser(request, env);
      } else if (pathname === '/api/users' && request.method === 'GET') {
        const users = await env.DB.prepare('SELECT id, email FROM user').all();
        return new Response(JSON.stringify(users), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {Request} request - La solicitud HTTP.
 * @param {Env} env - Las variables de entorno del Worker.
 * @returns {Promise<Response>} - Una respuesta HTTP.
 */
async function createUser(request, env) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verifica si el usuario ya existe
  const existingUser = await env.DB.prepare('SELECT id FROM user WHERE email = ?')
    .bind(email)
    .first();

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'User already exists.' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = generateUUID();
  const { hash, salt } = await hashPassword(password);

  await env.DB.prepare(
    'INSERT INTO user (id, email, password) VALUES (?, ?, ?)'
  )
    .bind(userId, email, `${hash}:${salt}`)
    .run();

  return new Response(JSON.stringify({ message: 'User created successfully.', id: userId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Autentica a un usuario con email y contraseña.
 * @param {Request} request - La solicitud HTTP.
 * @param {Env} env - Las variables de entorno del Worker.
 * @returns {Promise<Response>} - Una respuesta HTTP.
 */
async function loginUser(request, env) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await env.DB.prepare('SELECT id, password FROM user WHERE email = ?')
    .bind(email)
    .first();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const [storedHash, storedSalt] = user.password.split(':');

  const isValidPassword = await verifyPassword(password, storedHash, storedSalt);

  if (!isValidPassword) {
    return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Login successful.', id: user.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

