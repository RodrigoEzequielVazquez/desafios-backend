import ProductManager from "../daos/mongodb/ProductMongo.dao.js";
import CartService from "../services/cart.service.js";
import { ErrorEnum } from "../services/errors/enums.js";
import { generateErrorId, generateErrorProductInfo, generateErrorActualizarProductInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.class.js";
import ProductService from "../services/product.service.js";
const productManager = new ProductManager();

export default class CartController {

    constructor() {
        this.cartService = new CartService()
        this.productService = new ProductService()
    }

    async consultarCartsController() {
        const carts = await this.cartService.consultarCartsService();
        return carts

    }

    async consultarCartsPorIdController(req,res) {
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
            return res.send({status:"success", payload: cart});
        }
    }

    async crearCartController() {
        const cart = await this.cartService.crearCartService();
        return cart
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

        if (req.user.rol == "Premium" && producto.owner == req.user.email) {
            return res.send({error:"error", payload: "Un usuario premium no puede agregar productos que le pertenezcan a su carrito"})
        }
        else{
            await this.cartService.agregarProductoEnCarritoService(cartId, productId);
            return res.send({ status: "El producto se agrego correctamente" });
        }

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

    async eliminarTodosLosProductosController(req) {
        const cartId = req.params.cid

        await this.cartService.eliminarTodosLosProductosService(cartId);
        return "Se eliminaron todos los productos"

    }

    async procesoDeCompra(req,res) {

        const cartId = req.params.cid

        const comprador = req.user.email

        await this.cartService.procesoDeCompraService(cartId,comprador,res)
    }


}
