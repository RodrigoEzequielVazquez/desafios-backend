import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";
import config from "../../../config.js";

export default class ManagerCarts {

  connection = mongoose.connect(config.mongoURL)

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
    return result
  };

  agregarProductoEnCarrito = async (cart, product) => {
    cart.products.push({ product: product })
    await cart.save()
    return
  }

  eliminarProductoEnCarrito = async (cart, idProduct) => {
    cart.products.pull(idProduct)
    await cart.save()
    return
  }

  eliminarTodosLosProductos = async (cart) => {
    console.log(cart);
    cart.products = []
    await cart.save()
    return
  }

  actualizarCarrito = async (cart, arrProducts) => {
    cart.products = []
    cart.products = arrProducts
    await cart.save()
    return;
    
  }

  actualizarCantidadDelProducto = async (cart, productoActualizar, quantity) => {
    productoActualizar.quantity = quantity
    cart.save() 
    return
   
  }

}