const cartDao = require('../dao/cart.dao');
const productDao = require('../dao/product.dao');

const createCart = async () => {
    return await cartDao.create();
};

const getById = async (id) => {
    return await cartDao.getById(id);
};

const getPaginatedCarts = async (page, limit) => {
    return await cartDao.getPaginatedCarts(page, limit);
};

const addProductToCart = async (cartId, productId, quantity) => {
    console.log('Product ID recibido en addProductToCart:', productId); // Verifica el ID recibido
    const product = await productDao.getById(productId);
    console.log('Producto encontrado:', product); // Verifica si el producto se encuentra

    if (!product) {
        throw new Error('Producto no encontrado');
    }
    return await cartDao.addProductToCart(cartId, productId, quantity);
};


const updateCart = async (id, data) => {
    return await cartDao.updateCart(id, data);
};

const removeProduct = async (cartId, productId) => {
    return await cartDao.removeProduct(cartId, productId);
};

const updateProductQuantity = async (cartId, productId, quantity) => {
    return await cartDao.updateProductQuantity(cartId, productId, quantity);
};

const clearCart = async (cartId) => {
    return await cartDao.clearCart(cartId);
};

module.exports = {
    createCart,
    getById,
    getPaginatedCarts,
    addProductToCart,
    updateCart,
    removeProduct,
    updateProductQuantity,
    clearCart
};
