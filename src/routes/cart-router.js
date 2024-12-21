import { Router } from "express";
const router = Router();

//Llamamos al cartManager
import CartManager from "../manager/cart-manager.js"
const manager = new CartManager("./src/data/carts.json");

//crear nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: "Error al intentar crear un carrito" });
    }
})

// Listar todos los carritos
router.get("/", async (req, res) => {
    try {
        const carritos = await manager.getCarts(); // Método para obtener todos los carritos
        res.json(carritos);
    } catch (error) {
        res.status(500).json({ error: "Error al intentar listar los carritos" });
    }
});


//listamos los productos que pertenecen a determinado carrito

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carritoBuscado = await manager.getCarritoById(cartId);
        if (carritoBuscado) {
            res.json(carritoBuscado.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al intentar buscar el carrito" });
    }
});




//agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid); // Convertimos el ID a número
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await manager.agregarProductoAlCarrito(cartId, productId, quantity);
        if (actualizarCarrito) {
            res.json({ status: "success", mensaje: "Producto agregado al carrito", cart: actualizarCarrito });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al intentar agregar el producto al carrito" });
    }
});


export default router;