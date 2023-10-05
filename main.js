//Simulador interactivo

//Productos, precios y cantidades en stock
const inventario = {
    polera1: { nombre: "Polera 1", precio: 12500 , stock: 10 },
    polera2: { nombre: "Polera 2", precio: 15000, stock: 5 },
    polera3: { nombre: "Polera 3", precio: 13000, stock: 8 },
    poleron1: { nombre: "Polerón 1", precio: 30000, stock: 3 },
    poleron2: { nombre: "Polerón 2", precio: 35000, stock: 7 },
    poleron3: { nombre: "Polerón 3", precio: 40000, stock: 17 },
    mochila: { nombre: "Mochila", precio: 40000, stock: 21 },
    botella: { nombre: "Botella", precio: 30000, stock: 9 },
    juegodecartas: { nombre: "Juego de Cartas", precio: 10000, stock: 2 },
};

//Funcion para realizar una compra
function realizarCompra() {
    const carrito = [];

    while (true) {
        alert("Productos disponibles:");

        for (const key in inventario) {
            if (inventario.hasOwnProperty(key) && inventario[key].stock > 0) {
                alert(`${inventario[key].nombre} - Precio: $${inventario[key].precio} - Stock: ${inventario[key].stock}`);
            }
        }

        let producto = prompt("Ingresa el nombre del producto que deseas comprar (o 'Pagar' para terminar la compra):");

        if (producto === "Pagar") {
            break;
        }

        if (inventario.hasOwnProperty(producto) && inventario[producto].stock > 0) {
            carrito.push(inventario[producto]);
            inventario[producto].stock--;
            alert(`Has agregado ${inventario[producto].nombre} a tu carrito.`);
        } else {
            alert(`Lo siento, el producto ${producto} no esta disponible en stock en este momento.`);
        }
    }

    // Calcular el total de la compra
    let total = 0;
    for (const item of carrito) {
        total += item.precio;
    }

    alert(`Resumen de la compra:`);

    for (const item of carrito) {
        alert(`${item.nombre} - Precio: $${item.precio}`);
    }

    alert(`Total a pagar: $${total.toFixed(2)}`);
}

//Para ejecutar la compra
realizarCompra();