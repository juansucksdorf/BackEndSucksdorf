const cartModel = require('./models/cart.model');

const create = async () => {
    try {
        const newCart = new cartModel();
        await newCart.save();
        return newCart;
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const cart = await cartModel.findById(id).populate('products.product');
        if (cart) {
            return cart;
        } else {
            throw new Error("Carrito no encontrado.");
        }
    } catch (error) {
        console.error("Error al obtener carrito por ID:", error.message);
        throw error;
    }
};

const getPaginatedCarts = async (page = 1, limit = 10) => {
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: 'products.product'
    };

    try {
        const result = await cartModel.paginate({}, options);
        return result;
    } catch (err) {
        console.error('Error paginando carritos:', err.message);
        throw err;
    }
};


const addProductToCart = async (cartId, productId, quantity = 1) => {
    try {
        if (quantity <= 0) {
            quantity = 1;
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('ID de producto inválido');
        }

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex > -1) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, añádelo
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return await cart.populate('products.product').execPopulate(); // Asegúrate de usar `execPopulate` si usas Mongoose 5.x
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        throw error;
    }
};


const updateCart = async (id, data) => {
    try {
        const updatedCart = await cartModel.findByIdAndUpdate(id, data, { new: true }).populate('products.product');
        if (updatedCart) {
            return updatedCart;
        } else {
            throw new Error("Carrito no encontrado.");
        }
    } catch (error) {
        console.error("Error al actualizar carrito:", error.message);
        throw error;
    }
};

const removeProduct = async (cartId, productId) => {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado.");

        cart.products = cart.products.filter(p => !p.product.equals(productId));
        await cart.save();
        return cart.populate('products.product');
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error.message);
        throw error;
    }
};

const updateProductQuantity = async (cartId, productId, quantity) => {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado.");

        const product = cart.products.find(p => p.product.equals(productId));
        if (product) {
            product.quantity = quantity;
            await cart.save();
            return cart.populate('products.product');
        } else {
            throw new Error("Producto no encontrado en el carrito.");
        }
    } catch (error) {
        console.error("Error al actualizar cantidad de producto en el carrito:", error.message);
        throw error;
    }
};

const clearCart = async (cartId) => {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado.");

        cart.products = [];
        await cart.save();
        return cart.populate('products.product');
    } catch (error) {
        console.error("Error al vaciar carrito:", error.message);
        throw error;
    }
};

module.exports = {
    create,
    getById,
    getPaginatedCarts,
    addProductToCart, // Agrega esta línea
    updateCart,
    removeProduct,
    updateProductQuantity,
    clearCart
};
