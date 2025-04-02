import CartService from "../services/cart.service.js";
const cartService = new CartService();

class CartController {
  async crearCarrito(req, res) {
    try {
      const carrito = await cartService.crearCarrito();
      res.status(201).json(carrito);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  }

  async obtenerCarrito(req, res) {
    try {
      const carrito = await cartService.getCarritoById(req.params.cid);
      if (!carrito)
        return res.status(404).json({ error: "Carrito no encontrado" });
      res.json(carrito.products);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  }

  async agregarProducto(req, res) {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity || 1;
      const carrito = await cartService.agregarProducto(cid, pid, quantity);
      res.json(carrito.products);
    } catch (error) {
      res.status(500).json({ error: "Error al agregar producto" });
    }
  }

  async agregarProductoUsuario(req, res) {
    try {
      const productId = req.params.pid;
      const userCart = await cartService.getCarritoById(req.user.cart);
      if (!userCart)
        return res.status(404).json({ error: "Carrito no encontrado" });

      await cartService.agregarProducto(userCart._id, productId);
      res.status(200).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      res.status(500).json({ error: "Error al agregar al carrito" });
    }
  }

  async eliminarProducto(req, res) {
    try {
      const carrito = await cartService.eliminarProducto(
        req.params.cid,
        req.params.pid
      );
      res.json({ message: "Producto eliminado", carrito });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar producto" });
    }
  }

  async actualizarCarrito(req, res) {
    try {
      const carrito = await cartService.actualizarProductos(
        req.params.cid,
        req.body
      );
      res.json(carrito);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el carrito" });
    }
  }

  async actualizarCantidad(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const carrito = await cartService.actualizarCantidad(cid, pid, quantity);
      res.json(carrito);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar cantidad" });
    }
  }

  async vaciarCarrito(req, res) {
    try {
      const carrito = await cartService.vaciarCarrito(req.params.cid);
      res.json({ message: "Carrito vaciado", carrito });
    } catch (error) {
      res.status(500).json({ error: "Error al vaciar carrito" });
    }
  }
}

export default CartController;
