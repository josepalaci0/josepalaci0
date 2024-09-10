import { authMiddleware } from '../../middlewares';

// Controlador para autenticar a un usuario
export async function getLogut(request, env) {
    // Llamar al middleware para la autenticación
    const payload = await authMiddleware(request);

    // Si el middleware devuelve una respuesta, es porque la autenticación falló
    if (payload instanceof Response) {
        return payload; // Devuelve la respuesta de error
    }

    const user = await env.DB.prepare('update User set StatusSession = ? where UserId = ?')
        .bind(null,payload.userId)
        .run();

    // Si no se encuentra el usuario, devolver un error
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({logout:"Logout successful"}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

}
