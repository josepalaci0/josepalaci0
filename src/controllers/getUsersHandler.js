import { verifyToken } from '../utils';


// Controlador para obtener la lista de usuarios
export async function getUsersHandler(request, env) {
    
    const authHeader = request.headers.get('Authorization');

    // Verificar si el encabezado de autorización está presente y es un Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized access. Token is required.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];

    // Verificar la validez del token
    const payload =  await verifyToken(token);

    console.log(payload);    
    

    if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Consultar la base de datos para obtener la lista de usuarios
    const users = await env.DB.prepare('SELECT UserId, Email FROM User').all();

    return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}