const socket = io();

console.log("ARCHIVO INDEX");

socket.on("productos", (data) => {
  console.log("productos recibidos desde index.js", data);
  renderProductos(data);
});

// función para renderizar productos
const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((item) => {
    const productCard = document.createElement("div");
    productCard.className = "group relative";

    productCard.innerHTML = `
      <div class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
        <img src="${item.img}" 
             alt="${item.title}" 
             class="w-full h-48 object-cover object-center group-hover:opacity-75 transition-opacity">
      </div>

      <div class="mt-4 flex justify-between">
        <div>
          <h3 class="text-sm text-gray-700">${item.title}</h3>
          <p class="text-lg font-medium text-gray-900">$${item.price}</p>
          <p class="text-sm text-gray-600">Stock: ${item.stock}</p>
        </div>
        <button onclick="eliminarProducto('${item._id}')"
                class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    `;

    contenedorProductos.appendChild(productCard);
  });
};

const eliminarProducto = (id) => {
  console.log("eliminar producto desde el index.js");
  socket.emit("eliminarProducto", id);
  console.log("evento emitido para eliminar producto desde index.js");
};

// agregar producto con imagen
const productForm = document.getElementById("productForm");
if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm); // incluye imagen

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Producto agregado:", result);

      socket.emit("nuevoProductoAgregado"); // para actualizar lista

      productForm.reset();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });
}
