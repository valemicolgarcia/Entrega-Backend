
//IMPORTACIONES
import express from "express"; //framework para manejar servidro web y api
import path from "path";
import { engine } from "express-handlebars"; //motor de vistas handlebars para renderizar vistas dinamicas
import { Server } from "socket.io"; //libreria para manejar comunicacion en tiempo real entre cliente y servidor
import "./database.js"; //archivo database que configura la conexion con mongodb
//importo los routers definidos en las rutas para manejar la logica de los productos, carritos y vistas
import productManagerRouter from "./routes/product-manager-router.js";
import cartRouter from "./routes/cart-router.js";
import viewsRouter from "./routes/views-router.js";

//CREACION DEL SERVIDOR
const app = express(); //instancia de express para manejar solicitudes http
const PUERTO = 8080; //puerto en el que el servidor escuchara las solicitudes

//MIDDLEWARE
//son funciones que se ejecutan antes de llegar a las rutas para procesar las solicitudes
app.use(express.json());  //procesar solicitudes con datos en formatos JSON
app.use(express.urlencoded({ extended: true })); //procesar formularios en el formato x-www-form-urlencoded
//req.query
app.use(express.static("./src/public")); //sirve archivos estaticos desde la carpeya src/public 


//IMAGENES
// Servir archivos estáticos (imágenes y otros archivos públicos)
app.use(express.static(path.join(process.cwd(), "src/public")));

//para front 
import Handlebars from "handlebars";
Handlebars.registerHelper("multiply", (a, b) => a * b);
//para ver si me aplica los filtros
Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
});


//--

//CONFIGURACION DE HANDLEBARS
app.engine("handlebars", engine()); //configuro handlebars como motor de vistas de la aplicacion
app.set("view engine", "handlebars"); //indica que el motor predeterminado para renderizar las vistas sera handlebars
app.set("views", "./src/views"); //define la carpeta donde estan almacenadas las plantillas, vistas que se renderizan


/*
// Ruta raíz
app.get("/", (req, res) => {
    res.send("Bienvenido a mi API de productos y carritos");
});
*/

//DEFINICION DE RUTAS
app.use("/api/products", productManagerRouter); //defino que todas las rutas relacionadas con productos se manejaran con el router productManagerRouter
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


//INICIO DEL SERVIDOR
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


//----------------------------------------------------------------------------------------------
/*
//listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
});



//websockets.
import ProductManager from "./manager/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");
    //enviamos el array de productos al cliente que se conecto
    socket.emit("productos", await manager.getProducts());

    //agregamos producto
    socket.on("agregarProducto", async (producto) => {
        await manager.addProduct(producto);
        console.log("Se agrego un producto desde app.js");
        io.sockets.emit("productos", await manager.getProducts());
    })

    // Limpia cualquier listener duplicado antes de registrar uno nuevo


    //eliminamos producto
    socket.on("eliminarProducto", async (id) => {

        console.log("muestro el id del producto eliminado desde app.js" + id);
        await manager.deleteProduct(id);
        console.log("producto eliminado correctamente en el servidor desde app.js");
        io.sockets.emit("productos", await manager.getProducts());
    })


});

*/