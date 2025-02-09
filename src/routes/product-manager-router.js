//PRODUCT MANAGER ROUTER: define todas las rutas http relacionadas con la gestion de los productos
//permite que los clientes (como pagina web o api) realicen operaciones sobre los productos a traves de solicitudes http

//IMPORTACIONES Y CONFIGURACION DEL ROUTER
import { Router } from "express";
const router = Router(); //permite crear un conjunto de rutas que despues se pueden importar en app.js

//IMPORTACION DEL PRODUCT MANAGER
import ProductManager from "../manager/product-manager.js";
const productManager = new ProductManager(); //creamos instancia de la clase product manager, que contiene la logica para interactuar con la bd

//IMPORTACION DEL MIDDLEWARE PARA SUBIR IMAGENES
import { upload } from "../middleware/upload.js";


//GET /api/products --> obtiene una lista de productos con paginacion
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query; //obtiene los parametros de la URL (paginacion, orden, filtros)
        //numero de productos q va a devolver por pagina: 10
        //pagina de la paginacion: 1
        //sort: criterio de ordenamiento
        //query: filtro para buscar productos segun una condicion

        const productos = await productManager.getProducts({ //llamo al getProducts del productManager pasandole los parametros de la consulta
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        //devuelve un JSON con esto,que es lo que la consigna me pide que devuelva
        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});



//GET /api/products/:pid --> obtiene un producto por su id ---------------------------------
router.get("/:pid", async (req, res) => {
    const id = req.params.pid; //extrae pid de la URL

    try {
        const producto = await productManager.getProductById(id); //llama a getProductById en productManager para buscar el producto
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


/* AGREGAR PRODUCTO SIN IMAGEN
// POST /api/products --> agrega un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body; //extrae el cuerpo de la solicitud req.body con los datos del nuevo producto

    try {
        await productManager.addProduct(nuevoProducto); //llama a addProduct del productManager para guardarlo en la base de datos
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});
*/

// AGREGAR PRODUCTOS CON IMAGEN : ---------------
router.post("/", upload.single("img"), async (req, res) => {
    try {
        const nuevoProducto = req.body;
        if (req.file) {
            nuevoProducto.img = `/img/${req.file.filename}`; // Guardar la ruta de la imagen
        }

        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado exitosamente",
            product: nuevoProducto
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
//---------------------------------------

// PUT /api/products/:pid --> actualiza un producto por su ID ---------------------------------------------
router.put("/:pid", async (req, res) => {
    const id = req.params.pid; //extrae pid de la url y los nuevos datos de req.body
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado); //llama a updateProduct de productManager para actualizar el producto en mongodb
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


// DELETE /api/products/:pid --> elimina producto por su ID ---------------------------------------------
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid; //extrae el pid de la URL

    try {
        await productManager.deleteProduct(id); //llama a delete product de productmanager para eliminar el producto de la bd
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});



export default router;


/* RESUMEN DE FLUJO

1. Cliente hace una solicitud HTTP a /api/products.
2. product-manager-router.js recibe la solicitud y llama a los métodos de ProductManager.
3. ProductManager interactúa con MongoDB usando ProductModel.
4. MongoDB devuelve los datos, que son enviados de vuelta al cliente en formato JSON.


*/
