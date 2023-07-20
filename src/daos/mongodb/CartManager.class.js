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
    console.log(result.products);
    return result
  };

  agregarProductoEnCarrito = async (idCart, idProduct) => {
    const product = await this.productManager.consultarProductoPorId(idProduct)
    const cart = await this.consultarCartPorId(idCart)
    cart.products.push({ product: product })
    await cart.save()
    return
  }

  eliminarProductoEnCarrito = async (idCart, idProduct) => {
    const cart = await this.consultarCartPorId(idCart)
    cart.products.pull(idProduct)
    await cart.save()
    return
  }

  eliminarTodosLosProductos = async (idCart) => {
    const cart = await this.consultarCartPorId(idCart)
    cart.products = []
    await cart.save()
    return
  }

  actualizarCarrito = async (idCart, arrProducts) => {
    const cart = await this.consultarCartPorId(idCart)
    cart.products = []
    cart.products = arrProducts
    await cart.save()
    return;
    
  }

  actualizarCantidadDelProducto = async (idCart, idProduct, quantity) => {
    const cart = await cartModel.findById(idCart).populate("products.product")
    const productoActualizar = cart.products.find((product) => product._id == idProduct)
    console.log(productoActualizar);
    productoActualizar.quantity = quantity
    cart.save() 
    return
   
  }

}