import CartDAO from "../daos/mongodb/CartMongo.dao.js";
import ProductService from "./product.service.js";
import TicketService from "./ticket.service.js";

export default class CartService {

    constructor() {
        this.cartDAO = new CartDAO()
        this.productService = new ProductService()
        this.ticketService = new TicketService()
    }

    async consultarCartsService() {
        const carts = await this.cartDAO.consultarCarts();
        return carts
    }

    async consultarCartsPorIdService(id) {
        const cart = await this.cartDAO.consultarCartPorId(id);

        if (cart) {
            return cart
        }
        return

    }

    async crearCartService() {
        const cart = await this.cartDAO.crearCart();
        return cart
    }

    async agregarProductoEnCarritoService(cart, product) {
        await this.cartDAO.agregarProductoEnCarrito(cart, product);
        return
    }

    async actualizarCarritoService(cartId, arrProducts) {
        const cart = await this.consultarCartsPorIdService(cartId)
        if (!cart) {
            return "No se encontro el carrito, verifique los datos e intente nuevamente"
        }
        else {
            await this.cartDAO.actualizarCarrito(cart, arrProducts);
            return "Se actualizo el carrito"
        }

    }

    async actualizarCantidadDelProductoService(cartId, productId, quantity) {
        const cart = await this.consultarCartsPorIdService(cartId)
        if (!cart) {
            return "No se encontro el carrito, verifique los datos e intente nuevamente"
        }
        else {

            const productoActualizar = cart.products.find((product) => product._id == productId)

            if (productoActualizar) {
                await this.cartDAO.actualizarCantidadDelProducto(cart, productoActualizar, quantity);
                return "Se actualizo el carrito"
            }
            else {
                return "No se encontro el producto en el carrito que ingreso"
            }

        }
    }

    async eliminarProductoEnCarritoService(cartId, productId) {
        const cart = await this.consultarCartsPorIdService(cartId)
        if (!cart) {
            return "No se encontro el carrito, verifique los datos e intente nuevamente"
        }
        else {
            await this.cartDAO.eliminarProductoEnCarrito(cart, productId);
            return "Producto eliminado"
        }

    }

    async eliminarTodosLosProductosService(cartId) {
        const cart = await this.consultarCartsPorIdService(cartId)
        if (!cart) {
            return "No se encontro el carrito, verifique los datos e intente nuevamente"
        }
        else {
            await this.cartDAO.eliminarTodosLosProductos(cart);
            return "Se eliminaron todos los productos"
        }

    }

    async procesoDeCompraService(cartId, comprador, res) {
        const cart = await this.consultarCartsPorIdService(cartId)

        let arregloSinStock = []
        let arregloConStock = []

        const comprobarStock = cart.products.map(prod => {
            if (prod.product.stock >= prod.quantity) {

                this.productService.actualizarProductoPorIdService(prod.product._id, { stock: prod.product.stock - prod.quantity })

                let conStock = { producto: prod.product.title, cantidad: prod.quantity, precio: prod.product.price, descripcion: prod.product.description }

                arregloConStock.push(conStock)

                const eliminarComprados = this.eliminarProductoEnCarritoService(cartId, prod.product._id)

            }
            else {

                let sinStock = { sinStock: prod.product.title + ", id: " + prod.product._id }
                arregloSinStock.push(sinStock)

            }
        });
        if (arregloSinStock.length > 0) {
            return res.send({status:"error", payload: "los siguientes productos no tienen stock suficiente " + arregloSinStock})
        }

        const products = await this.ticketService.crearTicketService(arregloConStock, comprador)
        return res.send({status:"success", payload: products})
        
    }
}
