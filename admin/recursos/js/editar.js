// Obtener ID
const url = new URL(location.href);
const id_producto = url.searchParams.get("id");
// Referencia contenedor mensajes
const contenedorMensaje = document.getElementById("mensaje-accion");

// Funciones ---------------------------------------------
const obtenerProducto = async (id_producto) => {
  // Solicitamos api
  try {
    const datos = await fetch(`http://localhost:3000/productos/${id_producto}`);
    const producto = await datos.json();
    
    // Renderizar formulario
    renderizarFormulario(producto);
  } catch (error) {
    console.error(error);
  }
};
const eliminarProducto = (id_producto) => {
  const botonEliminar = document.getElementById("borrar-producto");
  botonEliminar.addEventListener("click", async () => {
    const confirmar = confirm("Está por eliminar un producto, ¿Continuar?");
    if (confirmar) {
      const respuesta = await fetch(
        `http://localhost:3000/productos/${id_producto}`,
        {
          method: "DELETE",
        }
      );
      if (respuesta.ok) {
        // Redireccionamos a inicio
        location.href = "./";
      }
    }
  });
};
const renderizarFormulario = (producto) => {
  const contenedor = document.getElementById("editar-producto");
  // Construimos el HTML
  let html = `<form id="formulario-editar" class="formulario-editar">
                    <label for="id-nombre">Nombre</label>
                    <input type="text" id="id-nombre" name="nombre" value="${producto.nombre}" required />
                    <label for="id-marca">Marca</label>
                    <input type="text" id="id-marca" name="marca" value="${producto.marca}" required />
                    <label for="id-categoria">Categoria</label>
                    <input type="text" id="id-categoria" name="categoria" value="${producto.categoria}" required />
                    <label for="id-stock">Stock</label>
                    <input type="number" id="id-stock" name="stock" value="${producto.stock}" required />
                    <button type="submit">Guardar</button>
                </form>`;
  // Asignamos el contenido
  contenedor.innerHTML = html;
  // Agregamos el escuchador de evento
  const formulario = document.getElementById("formulario-editar");
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datosCrudos = new FormData(formulario);
    const datosFormulario = Object.fromEntries(datosCrudos);
    const cuerpo = JSON.stringify(datosFormulario);
    // Envío asíncrono de datos
    envioDatos(id_producto, cuerpo);
    console.log(cuerpo);
    console.log(datosFormulario);
  });
};
const envioDatos = async (id_producto, cuerpo) => {
    try {
        const url = `http://localhost:3000/productos/${id_producto}`;
        console.log('URL:', url);
        console.log('Cuerpo:', cuerpo);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: cuerpo,
        });

        if (response.ok) {
            mostrarMensajeOk('Producto modificado');
        } else {
            if (response.status === 400) {
                mostrarMensajeAlerta('Datos incompletos');
            } else {
                throw new Error(`Error al modificar el producto: ${response.status} ${response.statusText}`);
            }
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud Fetch:', error);
        mostrarMensajeAlerta('Error al enviar los datos');
    }
};

const mostrarMensajeOk = (mensaje) => {
  contenedorMensaje.textContent = mensaje;
  contenedorMensaje.style.display = "block";
  contenedorMensaje.classList.add("mensaje-accion-ok");
};
const mostrarMensajeAlerta = (mensaje) => {
  contenedorMensaje.textContent = mensaje;
  contenedorMensaje.style.display = "block";
  contenedorMensaje.classList.add("mensaje-accion-alerta");
};
// ---------------------------------------------------------
// Invocar funciones ---------------------------------------
// ---------------------------------------------------------
obtenerProducto(id_producto);
// Dentro de eliminar producto se inicializa el escuchador
eliminarProducto(id_producto);
// Animaciones
contenedorMensaje.addEventListener("animationend", () => {
  // contenedorMensaje.classList.add('mensaje-accion-alerta');
  contenedorMensaje.style.display = "none";
});