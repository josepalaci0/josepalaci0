import { getUsersHandler } from './controllers/users/getUsersHandler';
import { createUser } from './controllers/users/createUser';
import { loginUser } from './controllers/users/loginUser';
import { getDashboard } from './controllers/users/getByTokenUser';
import { getLogut } from './controllers/users/getLogout';
import { createProduct } from './controllers/products/createProduct';
import { createCustomerOrder } from './controllers/customerOrder/createCustomerOrder';

const addCorsHeaders = (response) => {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Métodos permitidos
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Headers permitidos
  return new Response(response.body, {
    ...response,
    headers: newHeaders,
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Manejo de preflight (OPTIONS) para CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    try {
      let response;
      // Sirve el contenido estático
      if (pathname === '/' && request.method === 'GET') {
        response = new Response('Hello, world!', {
          headers: { 'Content-Type': 'text/plain' },
        });
      } else if (pathname === '/logout' && request.method === 'POST') {

        response = await getLogut(request, env);

      }
      else if (pathname === '/api/users/product' && request.method === 'POST') {
        response = await createProduct(request, env);
      } else if (pathname === '/api/users/customerorder' && request.method === 'POST') {
        response = await createCustomerOrder(request, env);

      }else if (pathname === '/' && request.method === 'POST') {
        response = await getDashboard(request, env);

      } else if (pathname === '/api/users' && request.method === 'POST') {
        response = await createUser(request, env);
      } else if (pathname === '/api/users/login' && request.method === 'POST') {
        response = await loginUser(request, env);
      } else if (pathname === '/api/users' && request.method === 'GET') {
        response = await getUsersHandler(request, env);
      } else {
        response = new Response('Not Found', { status: 404 });
      }

      // Añadir cabeceras CORS a todas las respuestas
      return addCorsHeaders(response);
    } catch (error) {
      console.error('Error:', error);
      return addCorsHeaders(new Response('Internal Server Error', { status: 500 }));
    }
  },
};

