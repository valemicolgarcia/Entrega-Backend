import CartModel from "../models/cart.model.js"; //importo el modelo cartModel para poder interactuar con la coleccion carts en mongodb

//import { promises as fs } from "fs";

class CartManager { //clase llamada cartManager para encapsular la logica para manejar los carritos de compras
    /*
    constructor(path) {
        this.carts = []; //almaceno el array de carritos cargados desde el archivo JSON
        this.path = path; //ruta del archivo JSON donde se guardan los carritos
        this.ultId = 0; //control del ultimo ID usado para asegurarse de que cd carrito tenga ID unico

        this.cargarCarritos(); //cargo los carritos almacenados en el archivo JSON cuando se crea una instancia de la clase
    }
    
    

    async getCarts() {
        // Llama al método cargarCarritos para cargar los carritos desde el archivo JSON y asegurarse de que los datos esten actualizados
        await this.cargarCarritos();
        return this.carts; // Retorna el array de carritos cargados
    }



    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                //Verifico si hay por lo menos un carrito creado. 
                this.ultId = Math.max(...this.carts.map(cart => cart.id))
                //Utilizo el metodo map para crear un nuevo array que solo obtenga los ids del carrito y con Math.max obtengo el mayor. 
            }
        } catch (error) {
            //Si no existe el archivo, lo voy a crear: 
            await this.guardarCarritos();
        }
    }


    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    */

    //CREAR CARRITO: crear un nuevo carrito vacio en la base de datos
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] }); //creo una instancia del modelo de carritos con un array vacio de productos
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el nuevo carrinho de compriñas");
        }
    }


    //GET CARRITO BY ID: obtener un carrito especifico por su id
    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId); //busca en la base de datos el carrito con el id especificado
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }

            return carrito;
        } catch (error) {
            console.log("Error al traer el carrito, fijate bien lo que haces", error);
        }
    }

    //AGREGAR PRODUCTO AL CARRITO
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId); //obtengo el carrito
            const existeProducto = carrito.products.find(item => item.product.toString() === productId); //busco si el producto ya existe en el carrito

            if (existeProducto) { //si ya existe le aumento la cantidad, sino se agrega el producto al array
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            //aviso a mongoose que el array products fue modificado
            carrito.markModified("products");

            await carrito.save(); //guardo el carrito actualizado en la base de datos
            return carrito;

        } catch (error) {
            console.log("error al agregar un producto", error);
        }
    }

    //ELIMINAR PRODUCTO DEL CARRITO: eliminar un producto especifico del carrito
    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId); //busco producto por su id

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId); //filtro el array de productos para eliminar el producto con id especificado

            await cart.save(); //guardo los cambios en la base de datos
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
            throw error;
        }
    }

    //ACTUALIZAR CARRITO: reemplazar todo el contenido del carrito con un nuevo array de productos
    async actualizarCarrito(cartId, updatedProducts) { //
        try {
            const cart = await CartModel.findById(cartId); //busco el carrito por su id

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts; //sobreescribo el array de products con el nuevo contenido

            cart.markModified('products');

            await cart.save(); //guardo los cambios en la bd

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    //ACTUALIZAR CANTIDAD DE PRODUCTO: actualizar la cantidad de un producto especifico en el carrito
    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId); //busca el producto por su id

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId); //encuentra el indice dentro del array products

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity; //actualiza la cantidad 


                cart.markModified('products');

                await cart.save(); //guarda los cambios en la bd
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }

    //VACIAR CARRITO: eliminar todos los productos del carrito
    async vaciarCarrito(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate( //reemplazo el array products por un array vacio
                cartId,
                { products: [] }, //array vacio
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }

}
export default CartManager;

//conexion de cart-manager con otros archivos
//1. cart-router.js: esta clase se importa para manejar las solicitudes http relacionadas con los carritos
//2. cartmodel: interactuar directamente con la base de datos en mongodb