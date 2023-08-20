import ManagerCarts from "../daos/mongodb/CartManager.class.js";
import ProductManager from "../daos/mongodb/ProductManager.class.js";
import { cartModel } from "../daos/mongodb/models/carts.model.js";

const managerCarts = new ManagerCarts();
const productManager = new ProductManager(); 

export const consultarCartsController = async () =>{
    const carts = await managerCarts.consultarCarts();
    if(!carts){
      return "No se encontraron carritos"
    }
    return carts

}

export const consultarCartsPorIdController = async (id) =>{
    const cart = await managerCarts.consultarCartPorId(id);
    if (cart) {
        return cart
    }
    return "Carrito no encontrado"
  
}

export const crearCartController = async () =>{
    await managerCarts.crearCart();
}

export const agregarProductoEnCarritoController = async (idCart,idProduct) =>{
    const product = await productManager.consultarProductoPorId(idProduct)
    const cart = await managerCarts.consultarCartPorId(idCart)
    if(!product || !cart){
        return "No se pudo agregar el producto, verifique los datos e intente nuevamente"
    }
    else{
        await managerCarts.agregarProductoEnCarrito(cart,product);
        return "Producto agregado"
    }
  
}

export const eliminarProductoEnCarritoController = async (idCart,idProduct) =>{
    const cart = await managerCarts.consultarCartPorId(idCart)
    if(!cart){
        return "No se encontro el carrito, verifique los datos e intente nuevamente"
    }
    else{
        await managerCarts.eliminarProductoEnCarrito(cart,idProduct);
        return "Producto eliminado"
    }
  
}

export const eliminarTodosLosProductosController = async (idCart) =>{
    const cart = await managerCarts.consultarCartPorId(idCart)
    if(!cart){
        return "No se encontro el carrito, verifique los datos e intente nuevamente"
    }
    else{
        await managerCarts.eliminarTodosLosProductos(cart);
        return "Se eliminaron todos los productos"
    }
  
}

export const actualizarCarritoController = async (idCart, arrProducts) =>{
    const cart = await managerCarts.consultarCartPorId(idCart)
    if(!cart){
        return "No se encontro el carrito, verifique los datos e intente nuevamente"
    }
    else{
        await managerCarts.actualizarCarrito(cart,arrProducts);
        return "Se actualizo el carrito"
    }
  
}

export const actualizarCantidadDelProductoController = async (idCart,idProduct, quantity) =>{
    const cart = await cartModel.findById(idCart).populate("products.product")
    if(!cart){
        return "No se encontro el carrito, verifique los datos e intente nuevamente"
    }
    else{
        if (isNaN(quantity)) {
            return "La cantidad ingresada debe ser expresada en numeros"
        }
        else{
            const productoActualizar = cart.products.find((product) => product._id == idProduct)
        if(productoActualizar){
            await managerCarts.actualizarCantidadDelProducto(cart,productoActualizar,quantity);
            return "Se actualizo el carrito"
        }
        else{
            return "No se encontro el producto en el carrito que ingreso"
        }
        } 
    }
}

