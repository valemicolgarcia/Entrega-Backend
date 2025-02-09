import mongoose from "mongoose"; //biblioteca que se utiliza para interactuar con mongodb


//defino el schema: objeto que nos permite definir la forma de los documentos que se almacenaran en una coleccion de mongodb
//configuro el nombre de los campos y el tipo de datos que almacenaran

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    thumbnails: {
        type: [String],
    },
});

//definimos el modelo, que vamos a usar como una clase
const ProductModel = mongoose.model("Product", productSchema);
//mongoose usara la coleccion products en mongodb (convierte el nombre en plural automaticamente)


export default ProductModel;

//conexion con otros archivos. este modelo se utiliza en:
//1. product-manager.js: para implemetar la logica de negocio
//2. product-manager-router.js: para exponer rutas como /api/products

