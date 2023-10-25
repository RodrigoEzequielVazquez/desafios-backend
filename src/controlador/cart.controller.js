import CartService from "../services/cart.service.js";
import { ErrorEnum } from "../services/errors/enums.js";
import { generateErrorId } from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.class.js";
import ProductService from "../services/product.service.js";

export default class CartController {

    constructor() {
        this.cartService = new CartService()
        this.productService = new ProductService()
    }

    async consultarCartsController(res) {
        const carts = await this.cartService.consultarCartsService();
        
        if (carts.length > 0) {
            return res.send({status:"success",payload:carts})
        }
        else{
            return res.send({status:"error",payload:"No hay carritos"})
        }

    }

    async consultarCartsPorIdController(req,res,view) {
        const id = req.params.cid;
        if (id.length != 24) {
            console.log(id.length);
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id,"carrito"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }
        else{
            const cart = await this.cartService.consultarCartsPorIdService(id);

            if (cart) {
                if (view == "view") {
                    return cart
               }
              
               return res.send({status:"success", payload: cart});
            }
            else{
                return res.send({status:"error",payload:"No hay carritos con el id" + id})
            }

           
        }
    }

    async crearCartController(res) {
        const cart = await this.cartService.crearCartService();
        if (cart) {
            return res.send({status:"success", payload: "Carrito creado con id: " + cart._id}) 
        }
        return res.send({status:"error", payload: "Error al crear el carrito"}) 
       
    }

    async agregarProductoEnCarritoController(req,res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // solo valido el producto por que el id del carrito se valida desde otro midlleware a nivel de ruta
        if (productId.length != 24) {
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(productId,"producto"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }

        const producto = await this.productService.constultarProductoPorIdService(productId)

        const cart = await this.cartService.consultarCartsPorIdService(cartId)

        if (producto ) {
            if (!cart) {
                return res.send({status:"error", payload: "No existe un carrito con el id: "+ cartId}) 
            }
            else{
                if (req.user.rol == "Premium" && producto.owner == req.user.email) {
                    return res.send({error:"error", payload: "Un usuario premium no puede agregar productos que le pertenezcan a su carrito"})
                }
                else{
                    await this.cartService.agregarProductoEnCarritoService(cart, producto);
                    return res.send({ status: "success", payload:"el producto se agrego correctamente" }).status(200);
                }
            }
        }
        return res.send({status:"error", payload: "No existe un producto con el id: "+ productId}) 

    }

    async actualizarCarritoController(req,res) {
        const cartId = req.params.cid;
        const arrProducts = req.body

        if (cartId.length != 24) {
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(cartId,"carrito"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }
        else{
            await this.cartService.actualizarCarritoService(cartId, arrProducts);
            return res.send({status:"success", payload: "El carrito se actualizo correctamente"});
        }

    }

    async actualizarCantidadDelProductoController(req,res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = Number(req.body.quantity)

        if (cartId.length != 24) {
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(cartId,"carrito"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }

        const cart = await this.cartService.actualizarCantidadDelProductoService(cartId, productId, quantity);
        res.send({status:"success", payload: cart});

    }

    async eliminarProductoEnCarritoController(req,res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        if (productId.length != 24) {
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(productId,"producto"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }

        await this.cartService.eliminarProductoEnCarritoService(cartId, productId);
        return  res.send({status:"success", payload: "Producto eliminado"});

    }

    async eliminarTodosLosProductosController(req,res) {
        const cartId = req.params.cid

        let result = await this.cartService.eliminarTodosLosProductosService(cartId);
        return res.send({ status: "success", payload: result });

    }

    async procesoDeCompra(req,res) {

        const cartId = req.params.cid

        const comprador = req.user.email

        return await this.cartService.procesoDeCompraService(cartId,comprador,res)
        
    }


}
