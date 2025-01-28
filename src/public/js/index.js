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
        const productCard = document.createElement("div");

        productCard.className = "group relative"; //se asignan clases de css para dar estilo (tailwind)

        productCard.innerHTML = `

            <div class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                <img src="${item.img}" 
                     alt="${item.title}" 
                     class="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity">
            </div>

            <div class="mt-4 flex justify-between">
                <div>
                    <h3 class="text-sm text-gray-700">${item.title}</h3>
                    <p class="mt-1 text-lg font-medium text-gray-900">$${item.price}</p>
                </div>
                <button onclick="eliminarProducto(${item.id})" 
                        class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        contenedorProductos.appendChild(productCard);

        //agregamos al evento el boton de eliminar
        productCard.querySelector("button").addEventListener("click", () => {
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


const productForm = document.getElementById("productForm");
if (productForm) {
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const producto = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: Number(document.getElementById("price").value),
            img: document.getElementById("img").value,
            code: document.getElementById("code").value,
            stock: Number(document.getElementById("stock").value)
        };

        socket.emit("agregarProducto", producto);
        productForm.reset();
    });
}
