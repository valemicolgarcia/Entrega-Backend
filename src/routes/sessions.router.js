import { Router } from "express";
import UsuarioModel from "../models/usuarios.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const user = await UsuarioModel.findOne({ usuario });

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (!isValidPassword(password, user)) {
            return res.status(401).json({ error: "contraseña incorrecta" });
        }

        //si la contra esta bien y encontramos el usuario, generamos el token
        const token = jwt.sign({ usuario: user.usuario, rol: user.rol }, "coderhouse", { expiresIn: "1h" }); //le paso la palabra clave

        res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
        res.redirect("/api/sessions/current");


    } catch (error) {
        console.error("error al hacer el login", error);
        res.status(500).json({ error: "error interno del servidor" });
    }
});

//registro
router.post("/register", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        const user = new UsuarioModel({
            usuario,
            password: createHash(password)
        })

        await user.save();
        res.redirect("/login");


    } catch (error) {
        console.error("error al registrar usuario", error);
        res.status(500).json({ error: "error interno del servidor" });

    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
})

//armamos la ruta current

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user) {
        res.render("profile", { usuario: req.user.usuario });
    } else {
        res.send("no estas autorizado");
    }
})

export default router;