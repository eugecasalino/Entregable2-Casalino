class Yerba {
    constructor(yerba, cantidad) {
        this.id = yerba.id;
        this.marca = yerba.marca;
        this.precio = yerba.precio;
        this.cantidad = cantidad;
        this.precioTotal = yerba.precio;
    }

    agregarUnidad() {
        this.cantidad++;
    }

    quitarUnidad() {
        this.cantidad--;
    }

    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }
}


// Constantes y variables de productos
const yerbas = [
    {
        id: 0,
        marca: "Amanda",
        descripcion: "500gr.",
        precio: 740,
        img: "./imgyerba/amanda.jpg",
    },

    {
        id: 1,
        marca: "Cachamate",
        descripcion: "Hierbas Cuyanas 500gr.",
        precio: 650,
        img: "./imgyerba/cachamate.png",
    },

    {
        id: 2,
        marca: "CBSé",
        descripcion: "",
        precio: 860,
        img: "./imgyerba/cbse.png",
    },

    {
        id: 3,
        marca: "Cruz de Malta",
        descripcion: "500gr.",
        precio: 800,
        img: "./imgyerba/cruzdemalta.png",
    },

    {
        id: 4,
        marca: "La Merced",
        descripcion: "500gr.",
        precio: 800,
        img: "./imgyerba/lamerced.png",
    },

    {
        id: 5,
        marca: "Mañanita",
        descripcion: "500gr.",
        precio: 800,
        img: "./imgyerba/mañanita.png",
    },

    {
        id: 6,
        marca: "Playadito",
        descripcion: "500gr.",
        precio: 900,
        img: "./imgyerba/playadito.png",
    },

    {
        id: 7,
        marca: "Rosamonte",
        descripcion: "500gr.",
        precio: 600,
        img: "./imgyerba/rosamonte.png",
    },

    {
        id: 8,
        marca: "Taragüi",
        descripcion: "500gr.",
        precio: 600,
        img: "./imgyerba/taragui.png",
    },

    {
        id: 9,
        marca: "Union",
        descripcion: "500gr.",
        precio: 600,
        img: "./imgyerba/union.png",
    },
]

// Función para cargar el carrito desde el almacenamiento local
function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage")) || [];
    if (contenidoEnStorage) {
        let array = [];
        for (const objeto of contenidoEnStorage) {
            let yerba = new Yerba(objeto, objeto.cantidad);
            yerba.actualizarPrecioTotal();
            array.push(yerba);
        }

        imprimirTabla(array);
        return array;
    }
    return [];
}
    


// Función para imprimir productos en el HTML
function imprimirProductosEnHTML(array) {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";
    for (const yerba of array) {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="card text-center" style="width: 12em;">
        <div class="card-body">
            <img src="${yerba.img}" class="card-img-top img-fluid" alt="">
            <h2 class="card-title">${yerba.marca}</h2>
            <h5 class="card-subtitle mb-2 text-muted">${yerba.descripcion}</h5>
            <p class="card-text">$${yerba.precio}</p>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button id="agregar${yerba.id}" type="button" class="btn btn-dark"> Agregar </button>
            </div>
            </div>
    </div>
    </div>      
`;
        contenedor.appendChild(card);
        let boton = document.getElementById(`agregar${yerba.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(yerba.id));
    }
}


// Agregar eventos a los botones "Agregar al Carrito"
agregarEventosAgregarAlCarrito();


// Función para agregar eventos a los botones "Agregar al Carrito"
function agregarEventosAgregarAlCarrito() {
    const botonesAgregar = document.querySelectorAll(".agregar-carrito");

    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const idProducto = event.target.getAttribute("data-id");
            agregarAlCarrito(idProducto);
        });
    });
}

// Llama a la función para imprimir productos y agregar eventos
imprimirProductosEnHTML(yerbas);

// Función para agregar un producto al carrito
function agregarAlCarrito(idProducto) {
    let yerbaEnCarrito = carrito.find((yerba) => yerba.id === idProducto);
    if (yerbaEnCarrito) {
        let index = carrito.findIndex((elemento) => elemento.id === yerbaEnCarrito.id);
        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        let cantidad = 1;
        carrito.push(new Yerba(yerbas[idProducto], cantidad));
    }

    // Actualizar el almacenamiento local y la tabla del carrito
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

// Evento para seleccionar múltiples productos
function seleccionarProductos() {
    let botonesAgregar = document.querySelectorAll(".agregar-carrito");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", (event) => {
            // Evita la acción por defecto del botón (navegar a una nueva página)
            event.preventDefault();

            // Agrega al carrito el producto correspondiente
            let id = event.target.id.replace("agregar", "");
            agregarAlCarrito(id);
        });
    });
}

// Llamar a la función para seleccionar productos cuando se carga la página
window.addEventListener("load", seleccionarProductos);

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    let yerba = carrito.find((yerba) => yerba.id === id);
    let index = carrito.findIndex((element) => element.id === yerba.id);
    if (yerba.cantidad > 1) {
        carrito[index].quitarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        carrito.splice(index, 1);
    }

    swal("Producto eliminado con éxito", "", "success");

    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito.length = 0;
    localStorage.removeItem("carritoEnStorage");

    document.getElementById("carrito").innerHTML = "";
    document.getElementById("acciones-carrito").innerHTML = "";
}

// Función para obtener el precio total de los productos en el carrito
function obtenerPrecioTotal(array) {
    return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

// Función para imprimir la tabla de productos en el carrito
function imprimirTabla(array) {
    let precioTotal = obtenerPrecioTotal(array);
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    let tabla = document.createElement("div");

    tabla.innerHTML = `
        <table id="tablaCarrito" class="table table-striped">
            <thead>         
                <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Accion</th>
                </tr>
            </thead>

            <tbody id="bodyTabla">
            </tbody>
        </table>
    `;

    contenedor.appendChild(tabla);


    let bodyTabla = document.getElementById("bodyTabla");

    for (let yerba of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${yerba.marca}</td>
                <td>${yerba.cantidad}</td>
                <td>$${yerba.precioTotal}</td>
                <td><button id="eliminar${yerba.id}" class="btn btn-dark">Eliminar</button></td>
`;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${yerba.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(yerba.id));
    }

    let accionesCarrito = document.getElementById("acciones-carrito");
    accionesCarrito.innerHTML = `
		<h5>PrecioTotal: $${precioTotal}</h5></br>
		<button id="vaciarCarrito" onclick="vaciarCarrito()" class="btn btn-dark">Vaciar Carrito</button>
	`;
}

// Función para filtrar productos
function filtrarBusqueda(e) {
    e.preventDefault();
    let ingreso = document.getElementById("busqueda").value.toLowerCase();
    let arrayFiltrado = yerbas.filter((elemento) => elemento.marca.toLowerCase().includes(ingreso));
    if (arrayFiltrado == "") {
        alert("no se encontraron elementos");
    }

    imprimirProductosEnHTML(arrayFiltrado);
}


// Función para mostrar la ventana modal de confirmación
function mostrarConfirmacionPedido() {
    $('#modalConfirmacion').modal('show');
}

// Función para ocultar la ventana modal de confirmación
function ocultarConfirmacionPedido() {
    $('#modalConfirmacion').modal('hide');
}

// Asociar la función de mostrarConfirmacionPedido al botón de confirmación
document.getElementById('confirmarPedidoBtn').addEventListener('click', mostrarConfirmacionPedido);

// Asociar la función de ocultarConfirmacionPedido al botón "Cancelar" de la ventana modal
document.getElementById('confirmarBtn').addEventListener('click', function() {
    // Aquí puedes agregar la lógica para procesar el pedido o realizar cualquier acción necesaria
    // Luego, puedes ocultar la ventana modal
    ocultarConfirmacionPedido();

    // También puedes mostrar un mensaje de confirmación o redirigir al usuario a una página de confirmación.
});
    

    function finalizarPedido() {
        if ($("#name").val().trim() === "") {
            $("#error-cliente").html("Debe ingresar un nombre");
            return;
        }
        if ($("#phone").val().trim() === "") {
            $("#error-cliente").html("Debe ingresar un teléfono");
            return;
        }
        if ($("#adress").val().trim() === "") {
            $("#error-cliente").html("Debe ingresar una dirección");
            return;
        }
        $("#error-cliente").html("");
        const nombre = $("#name").val();
        const direccion = $("#adress").val();
        const mensaje = `Muchas gracias por tu compra ${nombre}, estaremos enviando tu pedido a ${direccion} en los próximos minutos`;
    
        // Mostrar el mensaje
        $("#detalle-pedido").html(mensaje);
    
        // Cerrar el modal si existe (asegúrate de tener un modal con el ID "modal-pedido")
        $("#modal-pedido").modal("hide");


    
        // Limpiar los elementos
        $("#pedido-final").html("");
        $("#form-cliente").html("");
    }




// Evento para filtrar productos al hacer clic en el botón "Filtrar"
let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

// Inicializar la página cargando productos y el carrito desde el almacenamiento local
imprimirProductosEnHTML(yerbas);
const carrito = chequearCarritoEnStorage()