import { authMiddleware } from '../../middlewares';
import { generateUUID } from '../../utils';

const results = [
    {
        ProductId: '042d3f63-ac53-4121-91c0-64c46fa9f4c2',
        ProductName: 'Organic Coffee Beans',
        Description: 'High-quality organic coffee beans sourced from Colombia. Rich in flavor and aroma.',
        Price: '15.99',
        StockQuantity: 150
    },
    {
        ProductId: 'c7d8a474-03e5-4a35-aed2-eb9e3713b65c',
        ProductName: 'Espresso Machine',
        Description: 'A compact and efficient espresso machine perfect for home use. Comes with a milk frother.',
        Price: '249.99',
        StockQuantity: 25
    },
    {
        ProductId: '7c0fd703-5f48-4c1e-a7ad-4641b14253d6',
        ProductName: 'Espresso Machine',
        Description: 'A compact and efficient espresso machine perfect for home use. Comes with a milk frother.',
        Price: '249.99',
        StockQuantity: 25
    },
    {
        ProductId: '445b0762-6888-4fd0-bb83-48f621bff6c7',
        ProductName: 'Coffee Grinder',
        Description: 'Stainless steel coffee grinder with multiple grind settings for a perfect brew.',
        Price: '89.99',
        StockQuantity: 75
    },

]
export async function createCustomerOrder(request, env) {
    try {
        // Llamar al middleware para la autenticación
        const payload = await authMiddleware(request);

        // Si el middleware devuelve una respuesta, es porque la autenticación falló
        if (payload instanceof Response) {
            return payload; // Devuelve la respuesta de error
        }

        // Extraer los datos del cuerpo de la solicitud
        const { order } = await request.json();

        // Validar si OrderDate e items están presentes
        if (!order) {
            return new Response(JSON.stringify({ error: 'OrderDate and at least one item are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Generar un UUID para la nueva orden
        const OrderId = generateUUID();

        // Inicializar el total de la orden
        let TotalAmount = 0;

        // buscar todos los productos  regustradosen Product
        const result = await env.DB.prepare('SELECT * FROM Product').all();
        console.log(result);



        return new Response(JSON.stringify({ order }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });


    } catch (error) {
        // Manejar errores y devolver una respuesta de error
        console.error('Error in createCustomerOrder:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
