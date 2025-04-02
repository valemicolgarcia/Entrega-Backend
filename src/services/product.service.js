import ProductRepository from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

class ProductService {
  async getProducts(params) {
    // Acá podrías aplicar validaciones si quisieras
    return await productRepository.getProducts(params);
  }

  async getProductById(id) {
    if (!id) throw new Error("ID no proporcionado");
    return await productRepository.getProductById(id);
  }

  async addProduct(productData) {
    // Acá podrías validar que tenga los campos necesarios
    return await productRepository.addProduct(productData);
  }

  async updateProduct(id, productData) {
    if (!id) throw new Error("ID no proporcionado");
    return await productRepository.updateProduct(id, productData);
  }

  async deleteProduct(id) {
    if (!id) throw new Error("ID no proporcionado");
    return await productRepository.deleteProduct(id);
  }
}

export default ProductService;
