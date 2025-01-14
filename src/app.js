
//importaciones
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

import productManagerRouter from "./routes/product-manager-router.js";
import cartRouter from "./routes/cart-router.js";
import viewsRouter from "./routes/views-router.js";

//creacion del servidor
const app = express();
const PUERTO = 8080;

//middleware
//son funciones que se ejecutan antes de llegar a las rutas para procesar las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Express-Handlebars
app.engine("handlebars", engine()); //le digo a express que voy a usar handlebars para procesar archivos de plantillas
app.set("view engine", "handlebars"); //motor de vistas predeterminado que usara express
app.set("views", "./src/views"); //define la carpeta donde estan almacenadas las plantillas



// Ruta raíz
app.get("/", (req, res) => {
    res.send("Bienvenido a mi API de productos y carritos");
});

//rutas
app.use("/api/products", productManagerRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


//listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})