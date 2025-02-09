//cart-router.js define las rutas http para manejar carritos de compras
//permite que los clientes realicen operaciones sobre los carritos de compras mediante solicitudes http

//IMPORTACION Y CONFIGURACION DEL ROUTER
import { Router } from "express";
const router = Router();

//IMPORTACION E INSTANCIA DE CARTMODEL Y CARTMANAGER
import CartModel from "../models/cart.model.js";
import CartManager from "../manager/cart-manager.js"
const cartManager = new CartManager();

//POST /api/carts --> crea un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito(); //llama a crear carrito de cartManager
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



// GET /api/carts/:cid --> obtiene los productos de un carrito especifico
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId); //busca un carrito por su id en la base de datos 

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




// POST /api/carts/:cid/product/:pid --> agrega un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid; //extrae cart ID
    const productId = req.params.pid; //extrae product ID
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity); //llama a agregarproducto al carrito de cartmanager
        res.json(actualizarCarrito.products); //devuelve el carrito actualizado en json
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE /api/carts/:cid/product/:pid --> elimina un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId); //llama a metodo de cartManager para eliminar producto del carrito

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

// PUT /api/carts/:cid --> reemplaza los productos de un carrito con una nueva lista
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts); //recibe un nuevo array de productos en req.body y reemplaza los productos del carrito con metodo de cartManager
        res.json(updatedCart); //devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

// PUT /api/carts/:cid/product/:pid --> modifica la cantidad de un producto en un carrito
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity); //usa metodo de cartManager

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

// DELETE /api/carts/:cid --> vacia un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartManager.vaciarCarrito(cartId); //usa metodo de cartManager

        res.json({ //devuelve el carrito vacio
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});


export default router;