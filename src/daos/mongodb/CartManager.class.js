import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";


export default class ManagerCarts {

  connection = mongoose.connect("mongodb+srv://rodrigovazquez99:BcKutvT3FsEJwAOL@cluster0.y15gbah.mongodb.net/?retryWrites=true&w=majority")

  productManager = new ProductManager()

  consultarCarts = async () => {
    const result = await cartModel.find({})
    return result
  };

  crearCart = async () => {
    const result = await cartModel.create({ products: [] })
    return result
  };

  consultarCartPorId = async (id) => {
    const result = await cartModel.findOne({ _id: id }).populate("products.product")
    console.log(result);
    return result
  };

  agregarProductoEnCarrito = async (idCart, idProduct) => {
    const product = await this.productManager.consultarProductoPorId(idProduct)
    const cart = await this.consultarCartPorId(idCart)
    cart.products.push({product: product})
    await cart.save()
    return
  }
}