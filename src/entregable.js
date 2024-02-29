const fs = require('fs');
const path = require('path');
class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
    }

    async addProduct(producto) {
        try {
            // Validar la presencia de todos los campos obligatorios
            const { title, description, price, thumbnail, code, stock } = producto;
            if (title && description && price && thumbnail && code && stock) {

                // Leer productos existentes desde el archivo
                this.products = await this.getProducts();

                // Validar si el código del producto ya existe
                const productoExistente = this.products.find(prod => prod.code === code);

                if (productoExistente) {
                    console.error('¡El código ya existe!');
                } else {
                    // Asignar un ID automático
                    const nuevoIdProducto = this.getNextProductId();

                    // Agregar el nuevo producto al array
                    const nuevoProducto = {
                        id: nuevoIdProducto,
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                    };

                    this.products.push(nuevoProducto);

                    // Guardar el array actualizado en el archivo
                    await this.saveProductsToFile();

                    console.log("Producto agregado correctamente.");
                }

            } else {
                console.error('Todos los campos son obligatorios');
            }
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
        }
    }

    async getProducts() {
        try {
            // Leer el archivo y parsear su contenido
            const contenidoArchivo = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(contenidoArchivo);
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo, devolver un array vacío
            return [];
        }
    }

    async getProductById(id) {
        try {
            // Leer productos existentes desde el archivo
            this.products = await this.getProducts();

            // Buscar el producto con el ID especificado
            const producto = this.products.find((producto) => producto.id === id);

            if (producto) {
                return producto;
            } else {
                throw new Error("Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al obtener producto por ID:", error.message);
            throw error;
        }
    }

    async updateProduct(id, camposActualizados) {
        try {
            // Leer productos existentes desde el archivo
            this.products = await this.getProducts();

            // Encontrar el índice del producto con el ID 
            const indiceProducto = this.products.findIndex((producto) => producto.id === id);

            if (indiceProducto !== -1) {
                // Actualizar el producto con los campos proporcionados
                this.products[indiceProducto] = { ...this.products[indiceProducto], ...camposActualizados };

                // Guardar el array actualizado en el archivo
                await this.saveProductsToFile();

                console.log("Producto actualizado correctamente.");
            } else {
                throw new Error("Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            // Leer productos existentes desde el archivo
            this.products = await this.getProducts();

            // Filtrar el array para excluir el producto con el ID 
            this.products = this.products.filter((producto) => producto.id !== id);

            // Guardar el array actualizado en el archivo
            await this.saveProductsToFile();

            console.log("Producto eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            throw error;
        }
    }

    getNextProductId() {
        // Obtener el ID más alto y sumar 1
        const idMasAlto = this.products.reduce((maxId, producto) => (producto.id > maxId ? producto.id : maxId), 0);
        return idMasAlto + 1;
    }

    async saveProductsToFile() {
        // Guardar el array de productos en el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
}


async function main() {
    try {
        const productManager = new ProductManager(path.join(__dirname, '../assets/productos.json'));;

        // Agregar un producto
        await productManager.addProduct({
            title: 'Producto 1',
            description: 'Descripción del Producto 1',
            price: 3000,
            thumbnail: 'imagen1.jpg',
            code: 'P001',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 2',
            description: 'Descripción del Producto 2',
            price: 30050,
            thumbnail: 'imagen2.jpg',
            code: 'P002',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 3',
            description: 'Descripción del Producto 3',
            price: 3000,
            thumbnail: 'imagen3.jpg',
            code: 'P003',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 4',
            description: 'Descripción del Producto 4',
            price: 3000,
            thumbnail: 'imagen4.jpg',
            code: 'P004',
            stock: 50,
        });

        // Agregar otro producto
        await productManager.addProduct({
            title: 'Producto 5',
            description: 'Descripción del Producto 5',
            price: 35000,
            thumbnail: 'imagen5.jpg',
            code: 'P005',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 6',
            description: 'Descripción del Producto 6',
            price: 37000,
            thumbnail: 'imagen6.jpg',
            code: 'P006',
            stock: 40,
        });
        await productManager.addProduct({
            title: 'Producto 7',
            description: 'Descripción del Producto 7',
            price: 3000,
            thumbnail: 'imagen7.jpg',
            code: 'P007',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 8',
            description: 'Descripción del Producto 8',
            price: 3000,
            thumbnail: 'imagen81.jpg',
            code: 'P008',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 9',
            description: 'Descripción del Producto 9',
            price: 3000,
            thumbnail: 'imagen9.jpg',
            code: 'P009',
            stock: 50,
        });
        await productManager.addProduct({
            title: 'Producto 10',
            description: 'Descripción del Producto 10',
            price: 3000,
            thumbnail: 'imagen10.jpg',
            code: 'P0010',
            stock: 50,
        });

        // Obtener productos y mostrarlos
        const productos = await productManager.getProducts();
        console.log('Productos:', productos);

        // Obtener producto por ID y mostrarlo
        try {
            const productoPorId = await productManager.getProductById(1);
            console.log('Producto encontrado por ID:', productoPorId);
        } catch (error) {
            console.error(error.message);
        }

        // Actualizar producto y mostrar productos actualizados
        try {
            await productManager.updateProduct(1, { price: 25.99, stock: 60 });
            console.log('Productos después de la actualización:', await productManager.getProducts());
        } catch (error) {
            console.error(error.message);
        }

        // Eliminar producto y mostrar productos actualizados
        try {
            await productManager.deleteProduct(1);
            console.log('Productos después de la eliminación:', await productManager.getProducts());
        } catch (error) {
            console.error(error.message);
        }
    } catch (error) {
        console.error('Error en la función main:', error.message);
    }
}

// Llamar a la función main
main();
module.exports = ProductManager;