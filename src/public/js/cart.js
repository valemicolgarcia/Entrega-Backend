const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
const resultadoCompra = document.getElementById("resultadoCompra");

// Obtenemos el cartId desde el atributo en el <body>
const cartId = document.body.getAttribute("data-cart-id");

btnFinalizarCompra.addEventListener("click", async () => {
  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
    });

    const data = await response.json();

    if (data.ticket) {
      // Desactivar el botón después de la compra
      btnFinalizarCompra.disabled = true;
      btnFinalizarCompra.classList.add("opacity-50", "cursor-not-allowed");

      // Mostrar resultado de la compra
      resultadoCompra.innerHTML = `
        <div class="p-4 border rounded bg-green-50 text-green-800">
          <h3 class="text-lg font-bold mb-2">¡Compra exitosa!</h3>
          <p><strong>Código del ticket:</strong> ${data.ticket.code}</p>
          <p><strong>Fecha:</strong> ${new Date(
            data.ticket.purchase_datetime
          ).toLocaleString()}</p>
          <p><strong>Total:</strong> $${data.ticket.amount}</p>
           <p><strong>Comprador:</strong> ${data.ticket.purchaser}</p>
        </div>
      `;

      // Mostrar productos no disponibles
      if (
        data.productosNoDisponibles &&
        data.productosNoDisponibles.length > 0
      ) {
        resultadoCompra.innerHTML += `
          <div class="mt-4 p-4 border rounded bg-yellow-50 text-yellow-800">
            <h4 class="font-semibold mb-1">No se pudieron procesar los siguientes productos por falta de stock:</h4>
            <ul class="list-disc list-inside">
            ${data.productosNoDisponibles
              .map((prod) => `<li>${prod.title}</li>`)
              .join("")}
              
            </ul>
          </div>
        `;
      }

      // 🔄 Opcional: recargar los productos restantes del carrito
      actualizarVistaDelCarrito();
    } else {
      resultadoCompra.innerHTML = `
        <div class="text-red-600 p-4 border rounded bg-red-50">
          <p>Ocurrió un error al finalizar la compra.</p>
        </div>
      `;
    }
  } catch (error) {
    resultadoCompra.innerHTML = `
      <div class="text-red-600 p-4 border rounded bg-red-50">
        <p>Error inesperado: ${error.message}</p>
      </div>
    `;
  }
});

// 🔁 Función para recargar los productos restantes en el carrito
async function actualizarVistaDelCarrito() {
  try {
    const res = await fetch(`/api/carts/${cartId}`);
    const productos = await res.json();

    const contenedor = document.querySelector(".grid");
    if (!contenedor) return;

    contenedor.innerHTML = productos
      .map(
        (item) => `
        <div class="bg-white shadow-md rounded-lg p-4">
          <img src="${item.product.img}" alt="${
          item.product.title
        }" class="w-full h-48 object-cover rounded-t-lg">
          <h2 class="text-lg font-semibold text-gray-700">${
            item.product.title
          }</h2>
          <p class="text-gray-600">Cantidad: ${item.quantity}</p>
          <p class="text-gray-500">Precio unitario: $${item.product.price}</p>
          <p class="text-pink-600 font-bold mb-4">Subtotal: $${
            item.quantity * item.product.price
          }</p>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
  }
}
