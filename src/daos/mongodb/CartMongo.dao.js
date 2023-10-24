import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductMongo.dao.js";
import config from "../../../config.js";

export default class CartDAO {

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

  agregarProductoEnCarrito = async (cart, product, quantity = 1) => {

    console.log(cart);
    const cartProduct = cart.products.find(p => {
      return p.product._id.toString() === product.id
    })
    if (cartProduct) {
      cart.products = cart.products.filter(producto => {
        return  producto.product._id.toString() !== product.id
      })
      cart.products.push({product: product.id, quantity: cartProduct.quantity + quantity})
    } else {
      cart.products.push({ product: product.id, quantity: 1});
    }
    await cart.save()
    console.log(cart);
    return
  }

  eliminarProductoEnCarrito = async (cart, idProduct) => {
    cart.products.pull({product: idProduct})
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