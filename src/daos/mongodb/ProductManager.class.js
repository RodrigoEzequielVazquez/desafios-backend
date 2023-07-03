import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {

  connection = mongoose.connect("mongodb+srv://rodrigovazquez99:BcKutvT3FsEJwAOL@cluster0.y15gbah.mongodb.net/?retryWrites=true&w=majority")

  consultarProductos = async (limit = null) => {
    let result = await productsModel.find().lean()
    return result
  };

  crearProducto = async (product) => {
    let result = await productsModel.create(product) 
    return result;
  };

  consultarProductoPorId = async (id) => {
    let result = await productsModel.findOne({_id: id})
    return result
  };

  eliminarProductoPorId = async (id) => {
    let result = await productsModel.deleteOne({_id: id})
    return result
  }
  actualizarProductoPorId = async (id, updatedProduct) => {
    let result = await productsModel.updateOne({_id: id}, {$set: updatedProduct})
    return result;
  }

}