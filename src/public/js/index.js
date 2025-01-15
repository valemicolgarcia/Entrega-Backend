const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
})

//funcion para renderizar productos
//genera elementos html dinamicamente para mostrar la lista de productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    productos.forEach(item => {
        const card = document.createElement("div");
        //aca se le puede agregar una clase para darle estilo
        card.innerHTML = `
                            <p>${item.title} <p>
                            <p>${item.price} <p>
                            <p>${item.description} <p>
                            <button>Eliminar </button>

                        `

        contenedorProductos.appendChild(card);
        //agregamos al evento el boton de eliminar
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })

    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}


//agregamos productos desde el formulario

//detecta cuando un usuario hace clic en el boton de envio del formulario y llama a agregarProducto
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value,
    }

    socket.emit("agregarProducto", producto); //envia este objeto al servidor a traves del evento "agregarProducto"

}

