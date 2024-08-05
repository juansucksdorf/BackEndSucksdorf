require('dotenv').config(); 
const express = require('express');
const path = require('path');
const { create } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const { connectMongoDB } = require('./src/config/mongoDb.config');
const realTimeProductsRouter = require('./src/routes/realTimeProducts.router');

//express
const app = express();

// Middleware static
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar Handlebars
const hbs = create({
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  }
});
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');

// Inicia MongoDB
connectMongoDB();

// Rutas para las APIs
app.use('/api/realTimeProducts', realTimeProductsRouter);

// Ruta raíz
app.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const products = await productDao.getAll(page, limit, query, sort);

    res.render('index', {
      title: 'Productos',
      useWS: false,
      products: products.docs,
      pagination: {
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
        limit: products.limit
      }
    });
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).send('Error al obtener productos');
  }
});

// Iniciar el servidor
const server = app.listen(8080, () => {
  console.log('Servidor corriendo en 8080');
});

// Crear servidor para WebSocket
const { Server } = require('socket.io');
const wsServer = new Server(server);
app.set('ws', wsServer);

wsServer.on('connection', (socket) => {
  console.log('Nuevo cliente conectado en ws');

  socket.on('newProduct', (product) => {
    console.log('Nuevo producto agregado', product);
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Error en el servidor', message: err.message });
});

module.exports = app;
