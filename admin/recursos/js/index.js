// Implementación Front-End de API REST
const obtenemosProductos = async () => {
    try {
        // Solicitamos la API
        const response = await fetch('http://localhost:3000/productos');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const productos = await response.json();
        // Ordenamos los productos por ID en orden ascendente
        const productosOrdenados = ordenarPorIDAscendente(productos);
        // Renderizamos
        renderizar('productos', productosOrdenados);
    } catch (error) {
        console.error('Hubo un problema con la solicitud Fetch:', error);
    }
};

const ordenarPorIDAscendente = (productos) => {
    return productos.sort((a, b) => a.id - b.id);
};

const renderizar = (id, productos) => {
    // Donde se renderiza
    const contenedor = document.getElementById(id);
    // Construimos el HTML
    let html = '';
    productos.forEach((producto) => {
        html += `<article>
                    <ul>
                        <li class="productos-nombre">${producto.nombre} <a class="productos-nombre__boton" href="./editar.html?id=${producto.id}">editar</a> </li>
                        <li>Stock: ${producto.stock}</li>
                        <li>Categoria: ${producto.categoria}</li>
                        <li>Marca: ${producto.marca}</li>
                    </ul>
            </article>`;
    });
    // Asignamos el contenido
    contenedor.innerHTML = html;
};
// ---------------------------------------------------------
// Invocar funciones ---------------------------------------
// ---------------------------------------------------------
obtenemosProductos();