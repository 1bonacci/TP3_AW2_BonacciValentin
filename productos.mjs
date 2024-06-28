import express from 'express';
import cors from 'cors';
import pool from './app.mjs'
 
const router = express.Router();

// GET todos los productos
router.get('/', cors(), async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        
        res.status(200).json(resultado.rows);
    } catch (err) {
        res.status(500).send('Error al obtener los productos');
    }
});

// GET producto por id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resultado = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al obtener el producto');
    }
});

// POST crear nuevo producto
router.post('/', cors(), async (req, res) => {
    const { nombre, marca, categoria, stock } = req.body;
    try {
        const resultado = await pool.query('INSERT INTO productos (nombre, marca, categoria, stock) VALUES($1,$2,$3,$4) ',[nombre,marca,categoria,stock])

        res.status(201).json(resultado.rows);
    } catch (err) {
        res.status(500).send('Error al crear el producto');
    }
});

// PUT editar un producto
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, marca, categoria, stock } = req.body;
    try {
        const resultado = await pool.query('UPDATE productos SET nombre = $1, marca = $2, categoria = $3 , stock = $4 WHERE id = $5 ',[nombre,marca,categoria,stock,id])
        res.status(200).json(resultado.rows);

    } catch (err) {
        res.status(500).send('Error al actualizar el producto');
    }
});

// DELETE eliminar un producto
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resultado = await pool.query('DELETE FROM productos WHERE id = $1', [id]);

        res.status(200).send('Producto eliminado');

    } catch (err) {
        res.status(500).send('Error al eliminar el producto');
    }
});

export default router;