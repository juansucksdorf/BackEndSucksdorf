const express = require('express');
const app = express();
const fs = require('fs/promises');
const ProductManager = require('./managers/productManager');  
const CartManager = require('./managers/cartManager');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const productsFilename = `${__dirname}/../assets/productos.json`;
const cartsFilename = `${__dirname}/../assets/Carritos.json`;


const productManager = new ProductManager(productsFilename);
const cartManager = new CartManager(cartsFilename, productManager); 

productManager.loadProductsFromFile()
  .then(() => {
    return productManager.initialize();
  })
  .then(() => {
    
    app.use(express.json());
    app.use('/api/products', productRoutes);
    app.use('/api/carts', cartRoutes);

    app.get('/', (_, res) => {
      res.send('¡Bienvenido a la aplicación!');
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error en la inicialización:', error.message);
  });
