import { generateToken, verifyPassword } from '../utils.js';

// Controlador para autenticar a un usuario
export async function loginUser(request, env) {
    try {
      // Extraer el email y password del cuerpo de la solicitud
      const { email, password } = await request.json();
  
      // Verificar si el email y la contraseña están presentes
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Consultar la base de datos para obtener al usuario por su email
      const user = await env.DB.prepare('SELECT id, password FROM user WHERE email = ?')
        .bind(email)
        .first();
  
      // Verificar si el usuario existe
      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Separar el hash de la contraseña almacenada y el salt, si se está utilizando
      const [storedHash, storedSalt] = user.password.split(':');
  
      // Verificar si la contraseña proporcionada es válida
      const isValidPassword = await verifyPassword(password, storedHash, storedSalt);
  
      // Si la contraseña no es válida, devolver un error
      if (!isValidPassword) {
        return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Generar un token JWT para el usuario autenticado
      const token = await generateToken(user.id, 'user'); // El rol 'user' se usa como predeterminado
  
      // Devolver una respuesta de éxito con el ID del usuario y el token generado
      return new Response(JSON.stringify({ message: 'Login successful.', token: token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }