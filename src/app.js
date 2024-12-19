
import express from "express";
const app = express();
const PUERTO = 8080;

import productManagerRouter from "./routes/product-manager-router.js"
import cartRouter from "./routes/cart-router.js"


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//rutas
app.use("/api/products", productManagerRouter);
app.use("/api/carts", cartRouter);


//listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})