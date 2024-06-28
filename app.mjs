import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import productosRouter from './productos.mjs'

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

app.use(helmet())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static('www'))
app.use('/admin', chequearToken, express.static('admin'), )

app.use('/productos', productosRouter);

app.post('/login', cors(), async (req, res) => {
    //  Obtener datos del formulario del cliente
    const {usuario, clave} = req.body

    // Consulta BD
    try{
        const resultado = await pool.query('SELECT usuario FROM usuarios WHERE usuario = $1 AND clave = $2', [usuario, clave])
        
        // No puedo hacer que funcione el encriptado :(

        // Verificamos si el usuario esta registrado
        if(resultado.rowCount > 0) {
            // Si el usuario existe Generar el token
            const dbusuario = resultado.rows[0].usuario
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
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.redirect('/')
    }
})

export default pool

app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});