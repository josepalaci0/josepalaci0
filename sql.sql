-- Tabla User

DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User (
    UserId TEXT PRIMARY KEY,          -- Identificador único del usuario
    UserName TEXT,                    -- Nombre del usuario
    Email TEXT UNIQUE,                -- Correo electrónico del usuario (debe ser único)
    Password TEXT,                    -- Contraseña del usuario almacenada como hash y salt
    Estado TEXT,                      -- Estado del usuario (Ej: 'Activo', 'Inactivo')
    StatusSession TEXT                -- status de la sesion del usuario (Ej: 'Activo', 'Inactivo')
);

-- Tabla Product
DROP TABLE IF EXISTS Product;
CREATE TABLE IF NOT EXISTS Product (
    ProductId TEXT PRIMARY KEY,       -- Identificador único del producto
    ProductName TEXT,                 -- Nombre del producto
    Description TEXT,                 -- Descripción del producto
    Price TEXT,                       -- Precio del producto
    StockQuantity INTEGER            -- Cantidad en stock del producto
);

-- Tabla CustomerOrder
DROP TABLE IF EXISTS CustomerOrder;

CREATE TABLE IF NOT EXISTS CustomerOrder (
    OrderId TEXT PRIMARY KEY,         -- Identificador único del pedido
    UserId TEXT,                      -- Identificador del usuario que realizó el pedido
    OrderDate TEXT,                  -- Fecha del pedido
    TotalAmount TEXT,                -- Monto total del pedido
    FOREIGN KEY (UserId) REFERENCES User(UserId)  -- Relación con la tabla User
);

-- Tabla OrderItem
DROP TABLE IF EXISTS OrderItem;
CREATE TABLE IF NOT EXISTS OrderItem (
    OrderItemId TEXT PRIMARY KEY,     -- Identificador único del item del pedido
    OrderId TEXT,                    -- Identificador del pedido
    ProductId TEXT,                  -- Identificador del producto
    Quantity INTEGER,                -- Cantidad del producto en el pedido
    UnitPrice TEXT,                 -- Precio unitario del producto en el momento del pedido
    FOREIGN KEY (OrderId) REFERENCES CustomerOrder(OrderId),  -- Relación con la tabla CustomerOrder
    FOREIGN KEY (ProductId) REFERENCES Product(ProductId)  -- Relación con la tabla Product
);

