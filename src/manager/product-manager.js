
//const fs = require("fs").promises; //importo directamente la funcion, para que cd vez que llamo ya estoy trabajando con promesas
//con ESModules: import {promises as fs} from "fs";

import { promises as fs } from "fs";

class ProductManager {
    static ultId = 0; //pertence a la clase y no requeiren instancia

    constructor(path) {
        this.products = []; //arreglo vacio
        this.path = path;
    }

    async addProduct({ title, description, price, img, code, stock }) {

        //se leen los productos existentes
        const arrayProductos = await this.leerArchivo();

        //validamos que se agregaron todos los campos (todos los campos son obligatorios)
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios, falta alguno!");
            return; //para que no agregue un producto que este incompleto
        }

        //validamos que el codigo sea unico
        //some lo que hace es verificar que al menos un elemento del arreglo cumple con la condicion especificada
        if (arrayProductos.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return; //terminaria aca
        }

        //Si pasamos las validaciones, ahora podemos crear el objeto
        const nuevoProducto = {
            id: ++ProductManager.ultId, //id autoincrementable
            title,
            description,
            price,
            img,
            code,
            stock
        }

        //una vez que lo puedo crear lo pusheo al array
        arrayProductos.push(nuevoProducto);

        //una vez que agregamos el nuevo producto al array guardamos el array al archivo
        await this.guardarArchivo(arrayProductos);

    }

    async getProducts() {
        const arrayProductos = await this.leerArchivo();
        return arrayProductos;

    }

    async getProductById(id) {
        //leo el archivo y genero el array
        const arrayProductos = await this.leerArchivo();
        const producto = arrayProductos.find(item => item.id === id);
        //find busca y devuelve el primer elemento de un array que cumple con la condicion especificada

        if (!producto) {
            return ("Not found!");
        } else {
            return (producto);
        }

    }

    //el array lo recibo como algo plano pero debo convertirlo a JSON
    //armar metodos auxiliares que guarden el archivo y recuperen los datos
    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Hay un error al guardar el archivo");
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.log("Hay un error al leer el archivo");
        }
    }


    async deleteProduct(id) {
        try {
            // Verifico si el producto existe utilizando getProductById
            const producto = await this.getProductById(id);

            if (producto === "Not found!") {
                console.log(`Producto con ID ${id} no encontrado`);
                return { status: "error", mensaje: "Producto no encontrado" };
            }

            // Leo los productos actuales del archivo
            const arrayProductos = await this.leerArchivo();

            // Filtro los productos para eliminar el que coincide con el ID
            const productosActualizados = arrayProductos.filter(item => item.id !== id);

            // Guardo el array actualizado en el archivo
            await this.guardarArchivo(productosActualizados);

            console.log(`Producto con ID ${id} eliminado correctamente`);
            return { status: "success", mensaje: `Producto con ID ${id} eliminado` };
        } catch (error) {
            console.log("Error al intentar eliminar el producto", error);
            return { status: "error", mensaje: "Error al intentar eliminar el producto" };
        }
    }


}


export default ProductManager;