const ProductManager = require("./entregable"); 

const express = require("express");

const app = express();

const filename = `${__dirname}/../assets/Productos.json`; 

const productManager = new ProductManager(filename);

// Devolver listado de productos
app.get("/products", async (_, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
    return;
  } catch (err) {
    res.json({ error: "Error al obtener productos" });
    throw err;
  }
});

// Devolver un producto por ID
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (!product) {
      res.json({ error: 'Producto inexistente con ID ' + req.params.pid });
      return;
    }

    res.json(product);
    return;
  } catch (err) {
    res.json({ error: "Error al obtener producto con ID " + req.params.pid });
    throw err;
  }
});

app.get("/test", (_, res) => {
  res.end("Hola tester");
});

const main = async () => {
  try {
     
    app.listen(8080, () => {
      console.log("Servidor listo en el puerto 8080!");
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
  }
};

main();
