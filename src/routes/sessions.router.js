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

// --- GitHub Login ---
import jwt from "jsonwebtoken";

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role,
      },
      "coderhouse",
      { expiresIn: "1h" }
    );

    res.cookie("coderCookieToken", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.redirect("/api/sessions/current");
  }
);

// --- Google Login ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role,
      },
      "coderhouse",
      { expiresIn: "1h" }
    );

    res.cookie("coderCookieToken", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.redirect("/api/sessions/current");
  }
);

export default router;
