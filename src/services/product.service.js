import ProductDAO from "../daos/mongodb/ProductMongo.dao.js";

export default class ProductService {

    constructor() {
        this.productDAO = new ProductDAO
    }

    async consultarProductosService(limit, page, sort, filtro, filtroVal) {
      
        const products = await this.productDAO.consultarProductos(limit, page, sort, filtro, filtroVal)
        if (products) {
            return products
        }
    }

    async constultarProductoPorIdService(id) {
        const product = await this.productDAO.consultarProductoPorId(id);
        if (product) {
            return product
        }
        return "producto no encontrado"
    }

    async crearProductoService(product) {
        const crearProd = await this.productDAO.crearProducto(product);
        if (!crearProd) {
            
            return res.send({error:"Error", messagge: "Error service"})
        }
        return crearProd

    }

    async actualizarProductoPorIdService(id, actualizacion) {
        const product = await this.productDAO.actualizarProductoPorId(id, actualizacion);
        if (product) {
            return product
        }
        return "Error al intentar actualizar el producto"
    }

    async eliminarProductoPorIdService(id) {
        const product = await this.productDAO.eliminarProductoPorId(id);
        if (product) {
            return product
        }
        return "Error al intentar eliminar el producto"
    }

}
