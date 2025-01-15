//esta se encargara de las vistas de las diferentes plantillas

import { Router } from "express";
const router = Router();

import ProductManager from "../manager/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");



router.get("/products", async (req, res) => {
    try {
        const productos = await manager.getProducts();
        res.render("home", { productos, style: 'style.css' });

    } catch (error) {
        res.status(500).json({ error: "Error al intentar acceder al manager y a los datos" });
    }
})


router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

export default router;