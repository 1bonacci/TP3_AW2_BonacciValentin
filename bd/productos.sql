\c productos;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO productos (nombre, marca, categoria, stock) VALUES
('iPhone 13', 'Apple', 'Smartphones', 50),
('Galaxy S21', 'Samsung', 'Smartphones', 80),
('PlayStation 5', 'Sony', 'Consolas de Videojuegos', 30),
('Xbox Series X', 'Microsoft', 'Consolas de Videojuegos', 20),
('MacBook Pro', 'Apple', 'Laptops', 15),
('ThinkPad X1 Carbon', 'Lenovo', 'Laptops', 25),
('AirPods Pro', 'Apple', 'Auriculares', 100),
('Echo Dot', 'Amazon', 'Asistentes de Voz', 60),
('Smart TV 55" 4K', 'LG', 'Televisores', 40),
('Kindle Paperwhite', 'Amazon', 'Lectores de eBooks', 70);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (nombre, usuario, clave) VALUES
('admin', 'admin', 'pass'),
('Juan Pérez', 'jperez', 'clave123'),
('María López', 'mlopez', 'clave456'),
('Carlos Gómez', 'cgomez', 'clave789')