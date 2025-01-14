const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
})

//funcion para renderizar productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
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

    })
}

//agregamos productos desde el formulario

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
}