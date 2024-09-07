import { verifyToken } from '../utils';

// Controlador para obtener la lista de usuarios
export async function tokenUser(request, env) {
    
    const authHeader = request.headers.get('Authorization');

    // Verificar si el encabezado de autorización está presente y es un Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];

    // Verificar la validez del token
    const payload =  await verifyToken(token);

    const ts = JSON.stringify(payload.id);
    

    if (!payload) {
        return null
    }

  

    return ts;
}