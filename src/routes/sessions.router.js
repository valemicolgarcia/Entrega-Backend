//ahora el sessions router se comunica con el controlador, conecta los endpoints con el metodo del controlador que se requiera

import passport from "passport";
import { Router } from "express";
const router = Router();
//importo el controlador
import UserController from "../controllers/user.controller.js";
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get(
  "/current",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  userController.current
);
router.post("/logout", userController.logout);

//verificamos que un usuario sea admin
router.get(
  "/admin",
  passport.authenticate("current", {
    session: false,
  }),
  userController.admin
);

export default router;
