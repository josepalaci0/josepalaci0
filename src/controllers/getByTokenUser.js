import { authMiddleware } from '../middlewares';

export async function getDashboard(request, env) {
    // Llamar al middleware para la autenticación
    const payload = await authMiddleware(request);

    // Si el middleware devuelve una respuesta, es porque la autenticación falló
    if (payload instanceof Response) {
        return payload; // Devuelve la respuesta de error
    }

    // Consultar la base de datos para obtener la información del usuario autenticado
    const user = await env.DB.prepare('SELECT Email, UserName, StatusSession FROM User WHERE UserId = ?').bind(payload.userId).first();

    // Si no se encuentra el usuario, devolver un error
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
 