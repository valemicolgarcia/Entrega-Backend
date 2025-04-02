import { Router } from "express";
import passport from "passport";
import CartController from "../controllers/cart.controller.js";

const router = Router();
const controller = new CartController();

router.post("/", controller.crearCarrito);
router.get("/:cid", controller.obtenerCarrito);
router.post("/:cid/product/:pid", controller.agregarProducto);

// Ruta con usuario logueado (token actual)
router.post(
  "/add-to-cart/:pid",
  passport.authenticate("current", { session: false }),
  controller.agregarProductoUsuario
);

router.delete("/:cid/product/:pid", controller.eliminarProducto);
router.put("/:cid", controller.actualizarCarrito);
router.put("/:cid/product/:pid", controller.actualizarCantidad);
router.delete("/:cid", controller.vaciarCarrito);

export default router;
