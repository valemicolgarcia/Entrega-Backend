

import mongoose from "mongoose";


//un schema define como se estructuran los documentos en una coleccion de mongodb
const cartSchema = new mongoose.Schema({
    products: [ //array de objetos, donde cada objeto representa un producto agregado al carrito
        {
            product: { //referencia a la coleccion Product
                type: mongoose.Schema.Types.ObjectId, //almacena el objectId del producto en la base de datos
                ref: 'Product', //indica que este campo se refiere a la coleccion products
                required: true //campo obligatorio
            },
            quantity: {
                type: Number, //es un nro que representa la cantidad
                required: true //es obligatorio
            }
        }
    ]
});

// Middleware pre que realiza la población automáticamente
//ahora en vez de solo tener los ids de los productos, obtenemos los detalles completos de cd producto en el carrito
cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price img');
    next();
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;

//conexion con otros archivos
//1. cart-manager.js: este modelo es utilizado para manejar la logica de negocion de los carritos
//2. cart-router.js: el modelo se usa indirectamente a traves del cartmanager
