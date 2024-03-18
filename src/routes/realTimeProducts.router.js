const { Router } = require('express');
const router = Router();
const ProductManager = require('../managers/productManager');
const path = require('path');
const filename = path.join(__dirname, '../../assets/productos.json');
const productManager = new ProductManager(filename);

router.get('/', async (_, res) => {
    try {
        const products = await productManager.getProducts();

        res.render('realTimeProducts', {
            products: products,
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

        const newProduct = { title, description, price, thumbnail, code, status, stock };
        await productManager.addProduct(title, description, price, thumbnail, code, status, stock);
       
    
        req.app.get('ws').emit('newProduct', newProduct)

        // Renderizar la vista de la pagina
         const products = await productManager.getProducts();
                
        
                res.render('realTimeProducts', {
                    products: products,
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

router.delete('/:pid', async (req, res) => {
    try {

        const productId = parseInt(req.params.pid);

        await productManager.deleteProduct(productId);

        const products = await productManager.getProducts();

        req.app.get('ws').emit('updateFeed', products);

        res.status(301).redirect('/api/realTimeProducts');
    } catch {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;