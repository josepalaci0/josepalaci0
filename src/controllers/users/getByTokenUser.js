import { authMiddleware } from '../../middlewares';

export async function getDashboard(request, env) {
    try {
        // Verificar si el encabezado de autorización está presente y es un Bearer token
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized access. Token is required.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extraer el token del encabezado
        const token = authHeader.split(' ')[1];

        // Llamar al middleware para la autenticación
        const payload = await authMiddleware(request);

        // Si el middleware devuelve una respuesta, es porque la autenticación falló
        if (payload instanceof Response) {
            return payload; // Devuelve la respuesta de error
        }

        // Consultar la base de datos para verificar el token y el UserId
        const usertoken = await env.DB.prepare('SELECT Email, UserName FROM User WHERE StatusSession = ? AND UserId = ?')
            .bind(token, payload.userId)
            .first();

        // Si no se encuentra el usuario, devolver un error
        if (!usertoken) {
            return new Response(JSON.stringify({ error: 'User not Token' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Si todo va bien, devolver la información del usuario
        return new Response(JSON.stringify(usertoken), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        // Manejar cualquier error inesperado
        console.error('Error in getDashboard:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
