import { Router } from "express";
import passport from "passport";
import { soloAdmin, soloUser } from "../middleware/auth.js";
import { attachUser } from "../middleware/attachUser.js";
import ViewsController from "../controllers/view.controller.js";

const router = Router();
const controller = new ViewsController();

router.get("/products", attachUser, soloUser, controller.renderProducts);
router.get("/carts/:cid", controller.renderCartById);
router.get("/register", controller.renderRegister);
router.get("/login", controller.renderLogin);

router.get(
  "/mi-carrito",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.renderMiCarrito
);

/*
router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  soloAdmin,
  controller.renderRealTime
);
*/

export default router;
