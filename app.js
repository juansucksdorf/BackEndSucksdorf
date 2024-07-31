const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const { create } = require('express-handlebars');
const { Server } = require('socket.io');

// Managers
const ProductManager = require('./src/managers/productManager');
const CartManager = require('./src/managers/cartManager');

// Routes
const homeRoutes = require('./src/routes/home');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const realTimeProductsR = require('./src/routes/realTimeProducts.router');

// Filenames
const productsFilename = `${__dirname}/../assets/productos.json`;
const cartsFilename = `${__dirname}/../assets/Carritos.json`;

// Configurar Handlebars
const hbs = create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas para las APIs
app.use('/api/realTimeProducts', realTimeProductsR);

// Inicializar ProductManager y CartManager
const productManager = new ProductManager(productsFilename);
const cartManager = new CartManager(cartsFilename, productManager);

productManager.loadProductsFromFile()
  .then(() => productManager.initialize())
  .then(() => {
    app.use(express.json());
    app.use('/api/products', productRoutes);
    app.use('/api/carts', cartRoutes);
    app.use('/api/home', homeRoutes);

    // Ruta principal para la vista index
    app.get('/', (req, res) => {
      res.render('index', {
        title: 'websockets',
        useWS: true,
        products: [] 
      });
    });

    // Iniciar el servidor HTTP
    const server = app.listen(8080, () => {
      console.log('Servidor corriendo en 8080');
    });

    // Crear servidor para WebSocket
    const wsServer = new Server(server);
    app.set('ws', wsServer);

    wsServer.on('connection', (socket) => {
      console.log('Nuevo cliente conectado en ws');

      socket.on('newProduct', (product) => {
        console.log('Nuevo producto agregado', product);
      });
    });
  })
  .catch((error) => {
    console.error('Error en la inicialización:', error.message);
  });
