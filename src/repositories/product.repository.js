import ProductModel from "../dao/models/product.model.js";

//hace lo que hacia el product manager

class ProductRepository {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      // se verifica que todos los campos requeridos esten presentes
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      //se busca en la base de datos si ya existe un producto con el mismo codigo
      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El código debe ser único");
        return;
      }

      //creo una nueva instancia del producto con los datos recibidos
      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [], //si no se proporciona un array de imagenes se asigna un array vacio
      });

      await newProduct.save(); //se guarda el producto en la base de datos
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  //GET PRODUCTS: obtener productos desde la bd con opciones como paginacion, ordenamiento y filtrado
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    //se muestran 10 productos por pagina si no se indica otro valor
    //se mostrara la primera pagina si no se especifica otra

    try {
      const skip = (page - 1) * limit;

      //si query esta presente se filtran los productos por categoria
      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      //criterios de ordenamiento, por precio
      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      //consulta a mongodb
      const productos = await ProductModel.find(queryOptions) //obtiene productos que coincidan con los filtros
        .sort(sortOptions) //ordena los productos
        .skip(skip) //implementa paginacion
        .limit(limit); //implementa paginacion

      //cuenta el total de productos que coinciden con los filtros para calcular cuantas paginas hay en total
      const totalProducts = await ProductModel.countDocuments(queryOptions);

      //calculo el numero total de paginas, si hay pagina anterior o siguiente
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      //devuelve los productos y la informacion de la paginacion en un json
      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      console.log("Error al obtener los productos", error);
      throw error;
    }
  }

  //GET PRODUCT BY ID: busca un producto por su id
  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id); //busca un producto en mongodb

      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto encontrado");
      return producto;
    } catch (error) {
      console.log("Error al traer un producto por id");
    }
  }

  //UPDATE PRODUCT: actualiza un producto existente
  async updateProduct(id, productoActualizado) {
    try {
      const updateado = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      ); //busca el producto por su id, y actualiza los campos con los datos proporcionados

      if (!updateado) {
        console.log("No se encuentra el producto");
        return null;
      }

      console.log("Producto actualizado con exito");
      return updateado;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  //DELETE PRODUCT: elimina producto por su id
  async deleteProduct(id) {
    try {
      const deleteado = await ProductModel.findByIdAndDelete(id); //busca el producto por id y lo elimina de la coleccion

      if (!deleteado) {
        console.log("No se encuentraaaa, busca bien!");
        return null;
      }

      console.log("Producto eliminado correctamente!");
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

export default ProductRepository;
