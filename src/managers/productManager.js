const productDao = require('../dao/product.dao'); 

class ProductManager {
  async initialize() {
    console.log('Iniciando ProductManager...');
    console.log('ProductManager inicializado correctamente.');
  }

  async getProducts() {
    try {
      return await productDao.getAll(); // Usa productDao para obtener todos los productos
    } catch (error) {
      console.error("Error al obtener todos los productos:", error.message);
      throw error;
    }
  }
  async addProduct(producto) {
    try {
      const { title, description, price, thumbnail, code, stock } = producto;
      if (title && description && price && thumbnail && code && stock) {
        const productoExistente = await productDao.getById(code); // Usa productDao para verificar existencia
  
        if (productoExistente) {
          console.error('¡El código ya existe!');
          return { error: 'El código del producto ya existe.' };
        } else {
          const nuevoProducto = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
          };
  
          const result = await productDao.create(nuevoProducto); // Usa productDao para crear el producto
          console.log('Producto agregado correctamente:', result);
          return result;
          console.log(productDao);
        }
      } else {
        console.error('Todos los campos son obligatorios');
        return { error: 'Todos los campos son obligatorios' };
      }
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
      throw error;
    }
  }
  

  async getProductById(id) {
    try {
      const producto = await productDao.getById(id); // Usa productDao para obtener por ID
      if (producto) {
        return producto;
      } else {
        throw new Error("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error.message);
      throw error;
    }
  }

  async updateProduct(id, camposActualizados) {
    try {
      const productoActualizado = await productDao.update(id, camposActualizados); // Usa productDao para actualizar
      if (productoActualizado) {
        console.log("Producto actualizado correctamente.");
        return productoActualizado;
      } else {
        throw new Error("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error.message);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const resultado = await productDao.remove(id); // Usa productDao para eliminar
      if (resultado) {
        console.log("Producto eliminado correctamente.");
        return resultado;
      } else {
        throw new Error("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
      throw error;
    }
  }
}

module.exports = ProductManager;
