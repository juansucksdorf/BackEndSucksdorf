const mongoose = require('mongoose');

const connectMongoDB = async() => {
    try{
       await mongoose.connect("mongodb+srv://juansucksdorf:jBzwpqqn4lbHitxw@atlascluster.tzzpqvz.mongodb.net/ecommerce", {
       
      });
        console.log("mongo db conectado ");

    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
      }
    };
    
    module.exports = { connectMongoDB };