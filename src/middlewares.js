// middlewares/authMiddleware.js
import { verifyToken } from './utils';

export async function authMiddleware(request) {
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

    // Verificar la validez del token
    const payload = await verifyToken(token);

    if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return payload; // Devuelve el payload si la verificación es exitosa
}
