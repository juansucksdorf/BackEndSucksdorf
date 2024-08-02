const cartModel = require('../dao/models/cart.model'); 
const ProductManager = require("./productManager");

class CartManager {
  constructor(productManager) {
    this.productManager = productManager;
  }

  // Función para inicializar el CartManager
  async initialize() {
    try {
      console.log("Iniciando CartManager...");
      console.log("CartManager inicializado correctamente.");
    } catch (error) {
      console.error("Error al inicializar CartManager:", error.message);
      throw error;
    }
  }

  // Crear un nuevo carrito
  async createCart() {
    try {
      const newCart = new cartModel();
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error('Error al crear el carrito:', error.message);
      throw error;
    }
  }

  // Obtener todos los carritos
  async getCarts() {
    try {
      return await cartModel.find();
    } catch (error) {
      console.error("Error al obtener carritos:", error.message);
      throw error;
    }
  }

  // Obtener un carrito por ID
  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id);
      if (cart) {
        return cart;
      } else {
        throw new Error("Carrito no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener carrito por ID:", error.message);
      throw error;
    }
  }

  // Agregar un producto a un carrito
  async addToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);

      // Verificar si el producto existe en el administrador de productos
      const product = await this.productManager.getProductById(productId);

      if (product) {
        const newProduct = {
          id: productId,
          quantity: quantity,
        };

        cart.products.push(newProduct);

        await cart.save();

        console.log("Producto agregado al carrito correctamente.");
      } else {
        throw new Error("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw error;
    }
  }

  // Actualizar un carrito
  async updateCart(cartId, updateData) {
    try {
      const cart = await this.getCartById(cartId);
      
      if (cart) {
        Object.assign(cart, updateData);
        await cart.save();
        return cart;
      } else {
        throw new Error("Carrito no encontrado.");
      }
    } catch (error) {
      console.error("Error al actualizar carrito:", error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    const productManager = new ProductManager(); 
    const cartManager = new CartManager(productManager);
    await cartManager.initialize();
  } catch (error) {
    console.error(
      "Error al inicializar ProductManager o CartManager:",
      error.message
    );
  }
}

main();

module.exports = CartManager;
