import CartRepository from "../repositories/cart.repository.js";

import TicketModel from "../dao/models/ticket.model.js";
import UserModel from "../dao/models/user.model.js";
import ProductRepository from "../repositories/product.repository.js";
import { calcularTotal, generateUniqueCode } from "../utils/cartutils.js";

const productRepository = new ProductRepository();

const cartRepository = new CartRepository();

class CartService {
  crearCarrito() {
    return cartRepository.crearCarrito();
  }

  getCarritoById(cartId) {
    return cartRepository.getCarritoById(cartId);
  }

  agregarProducto(cartId, productId, quantity = 1) {
    return cartRepository.agregarProductoAlCarrito(cartId, productId, quantity);
  }

  eliminarProducto(cartId, productId) {
    return cartRepository.eliminarProductoDelCarrito(cartId, productId);
  }

  actualizarProductos(cartId, updatedProducts) {
    return cartRepository.actualizarCarrito(cartId, updatedProducts);
  }

  actualizarCantidad(cartId, productId, newQuantity) {
    return cartRepository.actualizarCantidadDeProducto(
      cartId,
      productId,
      newQuantity
    );
  }

  vaciarCarrito(cartId) {
    return cartRepository.vaciarCarrito(cartId);
  }

  async finalizarCompra(cartId) {
    const cart = await cartRepository.getCarritoById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productosNoDisponibles = [];

    for (const item of cart.products) {
      const product = await productRepository.getProductById(item.product);
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        productosNoDisponibles.push({
          _id: product._id,
          title: product.title,
        });
      }
    }

    const user = await UserModel.findOne({ cart: cartId });

    const ticket = new TicketModel({
      code: generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: calcularTotal(cart.products),
      purchaser: user.email,
    });
    await ticket.save();

    // Eliminar del carrito los productos que sí se compraron
    /*
    cart.products = cart.products.filter((item) =>
      productosNoDisponibles.some((id) => id.equals(item.product))
    );*/
    /*
    cart.products = cart.products.filter((item) =>
      productosNoDisponibles.some((id) => id.equals(item.product))
    );*/
    cart.products = cart.products.filter((item) =>
      productosNoDisponibles.some(
        (prod) => prod._id.toString() === item.product.toString()
      )
    );

    await cart.save();

    return { ticket, productosNoDisponibles };
  }
}

export default CartService;
