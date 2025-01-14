//esta se encargara de las vistas de las diferentes plantillas

import { Router } from "express";
const router = Router();

import ProductManager from "../manager/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");


//1 de la preentrega

router.get("/products", async (req, res) => {
    const productos = await manager.getProducts();
    res.render("home", { productos });
})


export default router;