
import { Router } from "express";
const router = Router();

//importamos el product manager
const ProductManager = require("./manager/product-manager.js");

//creamos instancia de la clase product manager
const manager = new ProductManager("./src/data/productos.json");
//el path que le paso como parametro hace referencia a la ruta donde se va a encontrar el archivo productos.json


//ruta para listar todos los productos
app.get("/api/products", async (req, res) => {
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
app.get("/api/products/:pid", async (req, res) => {
    let id = req.params.pid; //de los parametros la informacion viene en string
    const productoBuscado = await manager.getProductById(parseInt(id));
    res.send(productoBuscado);
})



app.post("/api/products", async (req, res) => {

    const { title, description, price, img, code, stock, status, category, thumbnails } = req.body;
    await manager.addProduct({ title, description, price, img, code, stock });
    res.send({ status: "success", mensaje: "Producto creado correctamente" });

})

/*La ruta PUT /:pid deberá tomar un producto y actualizarlo por los 
campos enviados desde body. 
NUNCA se debe actualizar o eliminar el id al momento de 
hacer dicha actualización.
*/

app.put("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const campos = req.body;


    const productos = await manager.getProducts();


    const productIndex = productos.findIndex(product => product.id === parseInt(pid));

    if (productIndex !== -1) {

        if (campos.title) productos[productIndex].title = campos.title;
        if (campos.description) productos[productIndex].description = campos.description;
        if (campos.price) productos[productIndex].price = campos.price;
        if (campos.img) productos[productIndex].img = campos.img;
        if (campos.code) productos[productIndex].code = campos.code;
        if (campos.stock) productos[productIndex].stock = campos.stock;
        if (campos.category) productos[productIndex].category = campos.category;
        if (campos.thumbnails) productos[productIndex].thumbnails = campos.thumbnails;


        await manager.guardarArchivo(productos);


        res.send({ status: "success", mensaje: "Producto actualizado correctamente", producto: productos[productIndex] });
    } else {
        // Si no se encuentra el producto
        res.status(404).send({ status: "error", mensaje: "Producto no encontrado" });
    }
});


app.delete("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const productos = await manager.getProducts();
    const productIndex = productos.findIndex(product => product.id === parseInt(pid));

    if (productIndex !== -1) {
        //si el producto existe lo elimino
        productos.splice(productIndex, 1);
        await manager.guardarArchivo(productos);
        res.send({ status: "success", mensaje: "Producto eliminado correctamente" });
    } else {
        res.status(404).send({ status: "error", mensaje: "Producto no encontrado" });
    }
});



export default router;
