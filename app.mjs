import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;

const {Pool} = pg

// Configura la conexión a la base de datos
const pool = new Pool({
    user: '',
    host: 'localhost',
    database: '',
    password: '',
    port: 5432,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

app.use(express.json());

// GET all products
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send('Error al obtener los productos');
    }
});

// GET product by ID
app.get('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al obtener el producto');
    }
});

// POST create a new product
app.post('/productos', async (req, res) => {
    const { nombre, marca, categoria, stock } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO productos (nombre, marca, categoria, stock) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, marca, categoria, stock]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Error al crear el producto');
    }
});

// PUT update a product
app.put('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, marca, categoria, stock } = req.body;
    try {
        const result = await pool.query(
            'UPDATE productos SET nombre = $1, marca = $2, categoria = $3, stock = $4 WHERE id = $5 RETURNING *',
            [nombre, marca, categoria, stock, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al actualizar el producto');
    }
});

// DELETE a product
app.delete('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length > 0) {
            res.status(200).send('Producto eliminado');
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al eliminar el producto');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});