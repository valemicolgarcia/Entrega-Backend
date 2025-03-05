//ARCHIVO VIEWS ROUTER

//Este archivo define las rutas para renderizar vistas con handlebars. En lugar de devolver datos en formatos json (como en las rutas api)
//aqui se usan res.render() para mostrar paginas html dinamicas

//objetivo:
//renderizar las paginas del frontend con datos de la base de datos
//mostrar productos /products y carritos /carts/:cid en vistas html

//IMPORTACION Y CONFIGURACION DEL ROUTER
import { Router } from "express";
const router = Router();

//IMPORTACION DE PRODUCTMANAGER Y CARTMANAGER
import ProductManager from "../manager/product-manager.js";
const productManager = new ProductManager();

import CartManager from "../manager/cart-manager.js"
const cartManager = new CartManager();


//GET /products --> renderiza la vista de productos paginados
//cuando el usuario accede a /products se ejecuta esta funcion
//carga los datos desde la base de datos y los muestra en una pagina html
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2, sort, query } = req.query; //otiene los parameteos de la URL (http://localhost:8080/products?page=2&limit=5    )
        const productos = await productManager.getProducts({ //paso page y limit a getProducts del productManager
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            query,
        });

        //declaro el array sin sacarle el id 
        const nuevoArray = productos.docs.map(producto => producto.toObject());

        /*
        const nuevoArray = productos.docs.map(producto => { //productos.docs: contiene los productos obtenidos desde mongodb
            const { _id, ...rest } = producto.toObject(); //convierte cada producto en un objeto javascript puro y se elimina el id para evitar conflictos con handlebars
            return rest;
        });
        */

        //renderiza la vista products.handlebars con los datos de los productos
        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
            usuario: req.user,
            query,
            sort,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});


//GET /carts/:cid --> renderiza la vista de un carrito especifico
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid; //obtiene el id del carrito desde la url

    try {
        const carrito = await cartManager.getCarritoById(cartId); //busca el carrito en mongodb con el metodo de cartmanager

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map(item => ({ //carrito.products contiene la lista de productos del carrito
            product: item.product.toObject(), //convierto cd producto en un objeto javascript puro, evita errores de handlebars al renderizar la vista
            quantity: item.quantity
        }));

        res.render("carts", { productos: productosEnCarrito }); //renderiza la vista carts.handlebars, pasnado los productos del carrito
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


/*
router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})
    */


// Backend 2:

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/login", (req, res) => {
    res.render("login");
})

import passport from "passport";


router.get("/mi-carrito", passport.authenticate("current", { session: false, failureRedirect: "/login" }), async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const cartId = req.user.cart;
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            return res.render("error", {
                message: "Carrito no encontrado",
                backUrl: "/products"
            });
        }

        /*
        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));
        */

        const productosEnCarrito = carrito.products
            .filter(item => item.product)  // elimina items sin producto
            .map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));

        // Calcular el total del carrito
        const total = productosEnCarrito.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        res.render("carts", {
            productos: productosEnCarrito,
            cartId: cartId,
            usuario: req.user,
            empty: productosEnCarrito.length === 0,
            total
        });

    } catch (error) {
        console.error("Error al obtener el carrito", error);
        /*
        res.render("error", {
            message: "Error al cargar el carrito",
            backUrl: "/products"
        });*/
    }
});

export default router;