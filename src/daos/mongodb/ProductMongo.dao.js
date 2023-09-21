import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";
import config from "../../../config.js";
import { v4 as uuidV4 } from "uuid";

export default class ProductDAO {

  connection = mongoose.connect(config.mongoURL)

  consultarProductos = async (limit = 10, page = 1, sort = 0, whereOptions = {}) => {
   // console.log(limit,page,sort,filtro,filtroVal);
    let result = await productsModel.paginate(whereOptions, {
      limit: limit, page: page, sort: { price: sort }, lean:true
    })
    //console.log(result);
    return result
  };

  crearProducto = async (product) => {
    product.code = uuidV4()
    console.log(product);
    let result = await productsModel.create(product)
    return result;
  };

  consultarProductoPorId = async (id) => {
    let result = await productsModel.findOne({ _id: id })
    console.log(result);
    console.log("daos");
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