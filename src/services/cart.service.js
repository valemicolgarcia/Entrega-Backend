import CartRepository from "../repositories/cart.repository.js";

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
}

export default CartService;
