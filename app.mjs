import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'

dotenv.config()

const puerto = process.env.PUERTO || 3333
const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const SECRETO = process.env.SECRETO
const {Pool} = pg

// Configura la conexión a la base de datos
const pool = new Pool({
    user: PG_USER,
    host: 'localhost',
    database: 'postgres',
    password: PG_PASSWORD,
    port: 5432,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

function chequearToken(req,res,next){
    // console.log('Cookie')
    // console.log(req.cookies)

    // Existe la cookie?
    if(req.cookies && req.cookies.token){
        const {token} = req.cookies
        try{
            jwt.verify(token, SECRETO)
            // Verificando -> sigo..
            next()
        } catch(error){
            res.redirect('/')
        }
        // console.log(token)
    } else {
        res.redirect('/')
    }
}

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static('publica'))
app.use('/admin', chequearToken, express.static('admin'), )


app.post('/login', async (req, res) => {
    //  Obtener datos del formulario del cliente
    const {usuario, clave} = req.body

    // Consulta BD
    try{
        const resultado = await pool.query('SELECT usuario FROM usuarios WHERE usuario = $1 AND clave = $2', [usuario, clave])
        
        // Verificamos si el usuario esta registrado
        // if(usuario === usuarios.usuario && pass === usuarios.pass)
        
        // Si el usuario existe Generar el token
        const dbusuario = resultado.rows[0]
        const token = jwt.sign({usuario:dbusuario}, SECRETO,{
            expiresIn:'10m'
        })

        // Enviamos el token en una cookie
        res.cookie('token', token,{
            httpOnly:true,
            samesite:'strict',
            secure:true
        })

        res.redirect('/admin')
        
    } catch (error) {
        res.redirect('/')
    }
})


// GET todos los productos
app.get('/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM productos');
        
        res.status(200).json(resultado.rows);
    } catch (err) {
        res.status(500).send('Error al obtener los productos');
    }
});

// GET producto por id
app.get('/productos/:id', async (req, res) => {
    const id = req.params.id;
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

// POST crear nuevo producto
app.post('/productos', async (req, res) => {
    const { nombre, marca, categoria, stock } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO productos (nombre, marca, categoria, stock) VALUES ($1, $2, $3, $4)',
            [nombre, marca, categoria, stock]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Error al crear el producto');
    }
});

// PUT editar un producto
app.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, marca, categoria, stock } = req.body;
    try {
        const result = await pool.query(
            'UPDATE productos SET nombre = $1, marca = $2, categoria = $3, stock = $4 WHERE id = $5',
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

// DELETE eliminar un producto
app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('DELETE FROM productos WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.status(200).send('Producto eliminado');
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al eliminar el producto');
    }
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});