import { generateUUID, hashPassword } from '../utils.js';

export async function createUser(request, env) {
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