import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {

  connection = mongoose.connect("mongodb+srv://rodrigovazquez99:BcKutvT3FsEJwAOL@cluster0.y15gbah.mongodb.net/?retryWrites=true&w=majority")

  consultarProductos = async (limit = 10, page = 1, sort = 0, filtro = null, filtroVal = null) => {
    let whereOptions = {}
    if (filtro != "" && filtroVal != "") {
      whereOptions = { [filtro]: filtroVal }
    }
   // console.log(limit,page,sort,filtro,filtroVal);
    let result = await productsModel.paginate(whereOptions, {
      limit: limit, page: page, sort: { price: sort }, lean:true
    })
    //console.log(result);
    return result
  };

  crearProducto = async (product) => {
    let result = await productsModel.create(product)
    return result;
  };

  consultarProductoPorId = async (id) => {
    let result = await productsModel.findOne({ _id: id })
    return result
  };

  eliminarProductoPorId = async (id) => {
    let result = await productsModel.deleteOne({ _id: id })
    return result
  }
  actualizarProductoPorId = async (id, updatedProduct) => {
    let result = await productsModel.updateOne({ _id: id }, { $set: updatedProduct })
    return result;
  }

}