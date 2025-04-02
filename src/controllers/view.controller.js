import ProductRepository from "../repositories/product.repository.js";
import CartRepository from "../repositories/cart.repository.js";

const productRepository = new ProductRepository();
const cartRepository = new CartRepository();

class ViewsController {
  async renderProducts(req, res) {
    try {
      const { page = 1, limit = 2, sort, query } = req.query;
      const productos = await productRepository.getProducts({
        page,
        limit,
        sort,
        query,
      });

      const nuevoArray = productos.docs.map((producto) => producto.toObject());

      res.render("products", {
        productos: nuevoArray,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        currentPage: productos.page,
        totalPages: productos.totalPages,
        usuario: req.user,
        query,
        sort,
      });
    } catch (error) {
      console.error("Error al renderizar productos", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderCartById(req, res) {
    try {
      const carrito = await cartRepository.getCarritoById(req.params.cid);
      if (!carrito)
        return res.status(404).json({ error: "Carrito no encontrado" });

      const productosEnCarrito = carrito.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));

      res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
      console.error("Error al renderizar carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderMiCarrito(req, res) {
    try {
      if (!req.user) return res.redirect("/login");

      const carrito = await cartRepository.getCarritoById(req.user.cart);
      if (!carrito) return res.status(404).send("Carrito no encontrado");

      const productosEnCarrito = carrito.products
        .filter((item) => item.product)
        .map((item) => ({
          product: item.product.toObject(),
          quantity: item.quantity,
        }));

      const total = productosEnCarrito.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0);

      res.render("carts", {
        productos: productosEnCarrito,
        cartId: req.user.cart,
        usuario: req.user,
        empty: productosEnCarrito.length === 0,
        total,
      });
    } catch (error) {
      console.error("Error en /mi-carrito", error);
    }
  }

  renderLogin(req, res) {
    res.render("login");
  }

  renderRegister(req, res) {
    res.render("register");
  }

  renderRealTime(req, res) {
    res.render("realtimeproducts");
  }
}

export default ViewsController;
