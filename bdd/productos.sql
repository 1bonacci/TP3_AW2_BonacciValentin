CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    stock INT NOT NULL
);