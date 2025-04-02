import userService from "../services/user.service.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";
//
import CartManager from "../dao/db/cart-manager-db.js";
const manager = new CartManager();

class UserController {
  async register(req, res) {
    const { first_name, lat_name, email, age, password } = req.body;
    try {
      const { first_name, last_name, email, password, age } = req.body;

      const nuevoCarrito = await manager.crearCarrito();

      //cada usuario tiene su carrito asociado
      const user = await userService.registerUser({
        first_name,
        last_name,
        email,
        age,
        password,
        cart: nuevoCarrito._id,
      });

      await user.save();
      res.redirect("/login");
    } catch (error) {
      console.error("error al registrar usuario", error);
      res.status(500).json({ error: "error interno del servidor" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.loginUser(email, password);
      //const user = await UserModel.findOne({ email });

      //si la contra esta bien y encontramos el usuario, generamos el token
      const token = jwt.sign(
        {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          cart: user.cart,
          role: user.role,
        },
        "coderhouse",
        { expiresIn: "1h" }
      ); //le paso la palabra clave

      res.cookie("coderCookieToken", token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.redirect("/api/sessions/current");
    } catch (error) {
      console.error("error al hacer el login", error);
      res.status(500).json({ error: "error interno del servidor" });
    }
  }

  async current(req, res) {
    if (req.user) {
      const user = req.user;
      const userDTO = new UserDTO(user); ////////HACER ESTEEEEEEEEE
      res.render("profile", { user: userDTO });
    } else {
      res.send("no estas autorizado");
    }
  }

  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.role != "admin") {
      return res.status(403).send("acceso denegado, no sos admin");
    }
    res.render("admin");
  }
}

export default UserController;
