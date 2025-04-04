//IMPORTACIONES
import express from "express"; //framework para manejar servidro web y api
import path from "path";
import { engine } from "express-handlebars"; //motor de vistas handlebars para renderizar vistas dinamicas
import http from "http";
import { Server } from "socket.io"; //libreria para manejar comunicacion en tiempo real entre cliente y servidor
import "./database.js"; //archivo database que configura la conexion con mongodb
//importo los routers definidos en las rutas para manejar la logica de los productos, carritos y vistas
//import productManagerRouter from "./routes/product-manager-router.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
//import cartRouter from "./routes/cart-router.js";
import viewsRouter from "./routes/views.router.js";
//import viewsRouter from "./routes/views-router.js";
import initializePassport from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";
import cookieParser from "cookie-parser";
import passport from "passport";
//PARA GITHUB:
import session from "express-session";
//variables de entorno
import dotenv from "dotenv";
dotenv.config();

//CREACION DEL SERVIDOR
const app = express(); //instancia de express para manejar solicitudes http
const PUERTO = 8080; //puerto en el que el servidor escuchara las solicitudes

//PARA GITHUB
app.use(
  session({
    secret: "coderhouse", // usa una clave secreta segura
    resave: false,
    saveUninitialized: false,
  })
);

//MIDDLEWARE
//son funciones que se ejecutan antes de llegar a las rutas para procesar las solicitudes
app.use(express.json()); //procesar solicitudes con datos en formatos JSON
app.use(express.urlencoded({ extended: true })); //procesar formularios en el formato x-www-form-urlencoded
//req.query
//app.use(express.static("./src/public")); //sirve archivos estaticos desde la carpeya src/public
//app.use(express.static("src/public"));
app.use(cookieParser());
app.use(passport.initialize());
//PARA GITHUB
app.use(passport.session());
//--
initializePassport();

//para ver si funciona el circulo del login
import { attachUser } from "./middleware/attachUser.js";
app.use(attachUser);
//------------------

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
//app.use("/api/products", productManagerRouter); //defino que todas las rutas relacionadas con productos se manejaran con el router productManagerRouter

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

//--------------------- esto en veremos

// Helper para comparar desigualdad
Handlebars.registerHelper("neq", function (a, b) {
  return a !== b;
});

// Helper para obtener la primera letra de un string
Handlebars.registerHelper("firstLetter", function (str) {
  return str && typeof str === "string" ? str.charAt(0) : "";
});
//-------------------

//INICIO DEL SERVIDOR
/*app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
*/
//----------------------------------------------------------------------------------------------

//listen
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});

import configureProductSockets from "./sockets/product.socket.js";
const io = new Server(httpServer);
configureProductSockets(io);
