const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartControllers');

// Crear un nuevo carrito
router.post('/create', async (req, res) => {
    try {
        const newCart = await cartController.createCart();
        // Configura la cookie 'cartId'
        res.cookie('cartId', newCart._id.toString(), { path: '/', httpOnly: true });
        res.status(201).json({ success: true, cart: newCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al crear el carrito.' });
    }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartController.getById(req.params.cid);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al obtener el carrito.' });
    }
});

// Obtener carritos paginados
router.get('/all', async (req, res) => {
    try {
        const { page, limit } = req.query;
        const carts = await cartController.getPaginatedCarts(page, limit);
        res.status(200).json({ success: true, carts });
    } catch (error) {
        console.error('Error al obtener los carritos:', error.message);
        res.status(500).json({ success: false, error: 'Error al obtener los carritos.' });
    }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const result = await cartController.addProductToCart(cid, pid, quantity);
        res.status(200).json({ success: true, cart: result });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al agregar producto al carrito.' });
    }
});

// Actualizar carrito con arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartController.updateCart(req.params.cid, req.body);
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al actualizar el carrito.' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartController.removeProduct(cid, pid);
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al eliminar producto del carrito.' });
    }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartController.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al actualizar la cantidad del producto en el carrito.' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartController.clearCart(req.params.cid);
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error.message);
        res.status(500).json({ success: false, error: 'Error al vaciar el carrito.' });
    }
});

module.exports = router;
