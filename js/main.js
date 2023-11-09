document.addEventListener('DOMContentLoaded', () => {
    let baseDeDatos = [];
    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    const DOMbotonFinalizarCompra = document.getElementById('boton-finalizar-compra');

    const cargarProductos = async () => {
        try {
            const response = await fetch('productos.json');
            const data = await response.json();
            baseDeDatos = data.baseDeDatos; // Modifica esta línea
            renderizarProductos();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };

    // Llama a la función cargarProductos al cargar el DOM
    cargarProductos();

    const renderizarProductos = () => {
        baseDeDatos.forEach(info => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4', 'mb-4', 'border-color');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoStock = document.createElement('p');
            miNodoStock.classList.add('card-text', 'mb-2');
            miNodoStock.textContent = `Stock: ${info.stock}`;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary', 'mr-2', 'btn');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', agregarProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoStock);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    const agregarProductoAlCarrito = evento => {
        const productoId = evento.target.getAttribute('marcador');
        const productoSeleccionado = baseDeDatos.find(producto => producto.id === parseInt(productoId));
        if (productoSeleccionado.stock > 0) {
            carrito.push(productoId);
            productoSeleccionado.stock--;
            renderizarCarrito();
            actualizarContadorCarrito(); // Actualiza el contador
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No hay suficiente stock de este producto.",
            });
        }
    }

    const renderizarCarrito = () => {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach(item => {
            const miItem = baseDeDatos.find(producto => producto.id === parseInt(item));
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
    
            const miNodo = document.createElement('ul');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2', 'border-color');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem.nombre} - ${miItem.precio}${divisa}`;
    
            const miBotonAgregar = document.createElement('button');
            miBotonAgregar.classList.add('btn', 'btn-primary', 'mr-2', 'btn-masmenos');
            miBotonAgregar.textContent = '+';
            miBotonAgregar.setAttribute('marcador', item);
            miBotonAgregar.addEventListener('click', agregarUnidadProducto);
    
            const miBotonRestar = document.createElement('button');
            miBotonRestar.classList.add('btn', 'btn-danger', 'btn-masmenos');
            miBotonRestar.textContent = '-';
            miBotonRestar.setAttribute('marcador', item);
            miBotonRestar.addEventListener('click', restarUnidadProducto);
    
            miNodo.appendChild(miBotonAgregar);
            miNodo.appendChild(miBotonRestar);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    };

    const restarUnidadProducto = evento => {
        const productoId = evento.target.getAttribute('marcador');
        const productoSeleccionado = baseDeDatos.find(producto => producto.id === parseInt(productoId));
        const index = carrito.indexOf(productoId);
    
        if (index !== -1) {
            carrito.splice(index, 1);
            productoSeleccionado.stock++;
            renderizarCarrito();
            guardarCarritoEnLocalStorage();
            actualizarContadorCarrito();
        }
    };

    const agregarUnidadProducto = evento => {
        const productoId = evento.target.getAttribute('marcador');
        const productoSeleccionado = baseDeDatos.find(producto => producto.id === parseInt(productoId));

        if (productoSeleccionado.stock > 0) {
            carrito.push(productoId);
            productoSeleccionado.stock--;
            renderizarCarrito();
            guardarCarritoEnLocalStorage();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No hay suficiente stock de este producto.",
            });
        }
    }

    const calcularTotal = () => {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.find(producto => producto.id === parseInt(item));
            return total + miItem.precio;
        }, 0).toFixed(2);
    }

    const vaciarCarrito = () => {
        // Restaurar el stock de los productos en el carrito
        carrito.forEach(item => {
            const productoSeleccionado = baseDeDatos.find(producto => producto.id === parseInt(item));
            if (productoSeleccionado) {
                productoSeleccionado.stock++;
                carrito = [];
                renderizarCarrito();
                localStorage.clear();
                actualizarContadorCarrito(); // Restablece el contador a 0
            }
        });

        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    const guardarCarritoEnLocalStorage = () => {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    const cargarCarritoDeLocalStorage = () => {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }



    function finalizarCompra() {
        if (carrito.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Carrito vacío",
                text: "Agrega productos antes de finalizar la compra.",
            });
        } else {
            const detalleCompraHTML = [];
            let totalCompra = 0;
            const carritoSinDuplicados = [...new Set(carrito)];
            carritoSinDuplicados.forEach((item) => {
                const miItem = baseDeDatos.find(producto => producto.id === parseInt(item));
                const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                    return itemId === item ? total += 1 : total;
                }, 0);
                const itemDetalle = `${numeroUnidadesItem} x ${miItem.nombre} - ${miItem.precio}${divisa}`;
                detalleCompraHTML.push(itemDetalle);
                totalCompra += miItem.precio * numeroUnidadesItem;
            });
    
            detalleCompraHTML.push(`Total a pagar: ${totalCompra}${divisa}`);
    
            Swal.fire({
                icon: "success",
                title: "¡Compra finalizada!",
                text: "Gracias por tu compra.",
                html: `<h4>Detalle de la compra:</h4><p>${detalleCompraHTML.join("<br>")}</p>`,
            });
        }
    }

    function actualizarContadorCarrito() {
        const contadorCarrito = document.getElementById('contador-carrito');
        contadorCarrito.textContent = carrito.length;
    }


    DOMbotonFinalizarCompra.addEventListener('click', finalizarCompra);

    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
    actualizarContadorCarrito();
});