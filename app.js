const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const socketIO = require('socket.io');



const server = http.createServer(app);
const io = socketIO(server);

const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
//managers
const ProductManager = require('./src/managers/productManager');
const CartManager = require('./src/managers/cartManager');
//routes
const homeRoutes = require('./src/routes/home')
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const realTimeProductsR = require('./src/routes/realTimeProducts.router');

//filename
const productsFilename = `${__dirname}/../assets/productos.json`;
const cartsFilename = `${__dirname}/../assets/Carritos.json`;

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../public')));;

app.use('/api/realTimeProducts', realTimeProductsR);





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
    app.use('/api/home', homeRoutes)
    
    app.get('/', (req, res) => {
      res.render('index', {
        title: 'websockets',
        useWS: true,
      });
    });
  })
  .catch((error) => {
    console.error('Error en la inicialización:', error.message);
  });
  const httpServer = app.listen(8080, () => {
    console.log('Servidor corriendo en 8080');
  });

  // Crear servidor para WebSocket
  const wsServer = new Server(httpServer);
  app.set('ws', wsServer)
  
  

  wsServer.on('connection', (socket)=>{
    console.log('nuevo cliente conectado en ws');

    socket.on('newProduct', (product) =>{
      console.log('Nuevo producto agregado', product)
    })
  })