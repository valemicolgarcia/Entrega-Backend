import ProductRepository from "../repositories/product.repository.js";
const manager = new ProductRepository();
import ProductModel from "../dao/models/product.model.js";

// ⚠️ Esta es la función que envolvés y exportás
export default function configureProductSockets(io) {
  io.on("connection", async (socket) => {
    console.log("🟢 Un cliente se conectó");
    console.log("ESTOY EN PRODUCT.SOCKET.JS");
    const resultado = await manager.getProducts();
    socket.emit("productos", resultado.docs);

    //socket.emit("productos", await manager.getProducts());

    socket.on("agregarProducto", async (producto) => {
      await manager.addProduct(producto);
      console.log("Se agregó un producto desde WebSocket");
      const resultado = await manager.getProducts();
      io.emit("productos", resultado.docs);
      //io.emit("productos", await manager.getProducts());
    });

    socket.on("eliminarProducto", async (id) => {
      console.log("Producto eliminado desde WebSocket con ID:", id);
      await manager.deleteProduct(id);
      const resultado = await manager.getProducts();
      io.emit("productos", resultado.docs);
      //io.emit("productos", await manager.getProducts());
    });

    socket.on("nuevoProductoAgregado", async () => {
      const resultado = await manager.getProducts();
      io.emit("productos", resultado.docs);
    });

    socket.on("aumentarStock", async (productId) => {
      try {
        const producto = await ProductModel.findById(productId);
        if (producto) {
          producto.stock += 1;
          await producto.save();
          const productosActualizados = await ProductModel.find();
          io.emit("productos", productosActualizados);
        }
      } catch (error) {
        console.error("Error al aumentar stock:", error);
      }
    });
  });
}
