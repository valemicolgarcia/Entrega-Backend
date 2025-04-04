import ProductService from "../services/product.service.js";

const productService = new ProductService();

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit, page, sort, query } = req.query;
      const productos = await productService.getProducts({
        limit,
        page,
        sort,
        query,
      });
      res.status(200).json(productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getProductById(req, res) {
    try {
      const id = req.params.pid;
      const producto = await productService.getProductById(id);
      if (!producto)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.status(200).json(producto);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async addProduct(req, res) {
    try {
      //const nuevoProducto = req.body;
      const nuevoProducto = {
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        code: req.body.code,
        stock: Number(req.body.stock),
        category: req.body.category,
        thumbnails: [],
      };

      if (req.file) {
        nuevoProducto.img = `/img/${req.file.filename}`; // si estás usando upload
      }
      const result = await productService.addProduct(nuevoProducto);
      res
        .status(201)
        .json({ message: "Producto agregado exitosamente", result });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;
      const result = await productService.updateProduct(
        id,
        productoActualizado
      );
      res.status(200).json({ message: "Producto actualizado", result });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.pid;
      const result = await productService.deleteProduct(id);
      res.status(200).json({ message: "Producto eliminado", result });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export default ProductController;
