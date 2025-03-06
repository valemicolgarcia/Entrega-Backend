import { Router } from "express";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (!isValidPassword(password, user)) {
            return res.status(401).json({ error: "contraseña incorrecta" });
        }

        //si la contra esta bien y encontramos el usuario, generamos el token
        const token = jwt.sign({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role
        }, "coderhouse", { expiresIn: "1h" }); //le paso la palabra clave

        res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
        res.redirect("/api/sessions/current");


    } catch (error) {
        console.error("error al hacer el login", error);
        res.status(500).json({ error: "error interno del servidor" });
    }
});

//
import CartManager from "../manager/cart-manager.js";
const manager = new CartManager();

//registro
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;

        const nuevoCarrito = await manager.crearCarrito();

        //cada usuario tiene su carrito asociado
        const user = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: nuevoCarrito._id
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

router.get("/current", passport.authenticate("current", { session: false, failureRedirect: "/login" }), (req, res) => {
    if (req.user) {
        res.render("profile", { usuario: req.user });
    } else {
        res.send("no estas autorizado");
    }
})

//verificamos que un usuario sea admin
router.get("/admin", passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user.role != "admin") {
        return res.status(403).send("acceso denegado, no sos admin");
    }
    res.render("admin");
})

//para autenticacion con GITHUB-------
import { generateToken } from "../utils/jsonwebtoken.js";


// version con github -------------------------------------------------------------------------------

router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {

})

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    //la estrategia de passport github nos retornara el usuario, entonces lo agregamos a nuestro objeto de sesion
    req.session.user = req.user;

    // Generar un token JWT con la información del usuario
    const token = generateToken({
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        cart: req.user.cart
    });
    // Setear la cookie para que la estrategia "current" la encuentre
    res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });

    res.redirect("/api/sessions/current");

})

//----------------------------------------- inicio de session con google


// Iniciar autenticación con Google (solicita acceso al perfil y email)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Ruta callback para Google
router.get("/googlecallback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Una vez autenticado, podes asignar el usuario a la sesión si usás sesiones:
        req.session.user = req.user;
        // Generar un token JWT con la información del usuario
        const token = generateToken({
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            cart: req.user.cart
        });
        // Setear la cookie para que la estrategia "current" la encuentre
        res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
        // Y redirigir a la ruta deseada, por ejemplo:
        res.redirect("/api/sessions/current");
    });



export default router;