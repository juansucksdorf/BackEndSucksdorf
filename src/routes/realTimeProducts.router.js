const { Router } = require('express');
const router = Router();
const productDao = require('../dao/product.dao');

router.get('/', async (req, res) => {
    try {
        const products = await productDao.getAll();

        res.render('realTimeProducts', {
            products: products.docs, // Si usas paginación, podrías necesitar acceder a .docs
            titlePage: 'Productos',
            h1: 'Productos en tiempo real',
            style: ['style.css'],
            script: ['realTimeProducts.js'],
            useWS: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, status, stock } = req.body;

        console.log('Datos recibidos del formulario:', req.body);

        const statusBoolean = status === 'true';
        const newProduct = { title, description, price, thumbnail, code, status: statusBoolean, stock };
        await productDao.create(newProduct);

        req.app.get('ws').emit('newProduct', newProduct);

        // Renderizar la vista de la página actualizada
        const products = await productDao.getAll();
        res.render('realTimeProducts', {
            products: products.docs, // Si usas paginación, podrías necesitar acceder a .docs
            titlePage: 'Productos',
            h1: 'Productos en tiempo real',
            style: ['style.css'],
            script: ['realTimeProducts.js'],
            useWS: true
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productDao.remove(productId);

        const products = await productDao.getAll();
        req.app.get('ws').emit('updateFeed', products.docs); // Emitir la lista actualizada de productos

        res.status(301).redirect('/api/realTimeProducts');
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
