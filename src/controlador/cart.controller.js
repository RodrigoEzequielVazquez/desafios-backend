import ProductManager from "../daos/mongodb/ProductMongo.dao.js";
import { cartModel } from "../daos/mongodb/models/carts.model.js";
import CartService from "../services/cart.service.js";

const productManager = new ProductManager();

export default class CartController {

    constructor() {
        this.cartService = new CartService()
    }

    async consultarCartsController() {
        const carts = await this.cartService.consultarCartsService();
        return carts

    }

    async consultarCartsPorIdController(req) {
        const id = req.params.cid;
        const cart = await this.cartService.consultarCartsPorIdService(id);
        return cart
    }

    async crearCartController() {
        const cart = await this.cartService.crearCartService();
        return cart
    }

    async agregarProductoEnCarritoController(req) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await this.cartService.agregarProductoEnCarritoService(cartId, productId);
    }

    async actualizarCarritoController(req) {
        const cartId = req.params.cid;
        const arrProducts = req.body

        await this.cartService.actualizarCarritoService(cartId, arrProducts);
        return "Se actualizo el carrito"

    }

    async actualizarCantidadDelProductoController(req) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = Number(req.body.quantity)

        const cart = await this.cartService.actualizarCantidadDelProductoService(cartId, productId, quantity);
        return cart

    }

    async eliminarProductoEnCarritoController(req) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await this.cartService.eliminarProductoEnCarritoService(cartId, productId);
        return "Producto eliminado"

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
