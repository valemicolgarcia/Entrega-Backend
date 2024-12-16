const express = require("express");
const app = express();
const PUERTO = 8080;

//importamos el product manager
const ProductManager = require("./manager/product-manager.js");

//creamos instancia de la clase product manager
const manager = new ProductManager("./src/data/productos.json");
//el path que le paso como parametro hace referencia a la ruta donde se va a encontrar el archivo productos.json


//rutas
app.get("/", (req, res) => {
    res.send("Hola mundo"); //el mensaje que da el servidor
})

//ruta para listar todos los productos
app.get("/products", async (req, res) => {
    //me guardo el query limit:
    let limit = req.query.limit;
    const productos = await manager.getProducts(); //me retorna todo el array de productos
    if (limit) {
        res.send(productos.slice(0, limit));
    } else {
        res.send(productos);
    }

})

//ruta para retornar producto por id: pid
app.get("/products/:pid", async (req, res) => {
    let id = req.params.pid; //de los parametros la informacion viene en string
    const productoBuscado = await manager.getProductById(parseInt(id));
    res.send(productoBuscado);
})


//listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})