import { getUsersHandler } from './controllers/getUsersHandler';
import { createUser } from './controllers/createUser';
import { loginUser } from './controllers/loginUser';

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
        return await getUsersHandler(request, env);
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};