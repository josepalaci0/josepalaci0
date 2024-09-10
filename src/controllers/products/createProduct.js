import { generateUUID } from '../../utils';

export async function createProduct(request, env) {
    try {
        // Extraer el nombre, precio, descripción y cantidad de stock del cuerpo de la solicitud
        const { name, price, description, stockQuantity } = await request.json();

        // Verificar si el nombre, precio, descripción y stockQuantity están presentes
        if (!name || !price || !description || stockQuantity === undefined) {
            return new Response(JSON.stringify({ error: 'Name, price, description, and stock quantity are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Generar un UUID para el nuevo producto
        const productId = generateUUID();

        // Insertar el producto en la base de datos
        const result = await env.DB.prepare('INSERT INTO Product (ProductId, ProductName, Price, Description, StockQuantity) VALUES (?, ?, ?, ?, ?)')
            .bind(productId, name, price, description, stockQuantity)
            .run();

        // Verificar si la inserción fue exitosa
        if (result.success) {
            // Crear un objeto de respuesta con la información del producto
            const product = {
                ProductId: productId,
                ProductName: name,
                Price: price,
                Description: description,
                StockQuantity: stockQuantity,
            };

            // Devolver el producto creado
            return new Response(JSON.stringify({ product }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            throw new Error('Failed to insert product into the database.');
        }
    } catch (error) {
        // Manejar errores y devolver una respuesta de error
        console.error('Error in createProduct:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
