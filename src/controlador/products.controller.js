import ProductDAO from "../daos/mongodb/ProductMongo.dao.js";
import ProductService from "../services/product.service.js";

export default class ProductController {

    constructor() {
        this.productService = new ProductService()
        this.productDAO = new ProductDAO()
    }

    async consultarProductosController(req) {
        let limit = Number(req.query.limit)
        let page = Number(req.query.page)
        let sort = Number(req.query.sort)
        let filtro = req.query.filtro
        let filtroVal = req.query.filtroVal

        if (limit || page || sort || filtro || filtroVal) {

            if (isNaN(limit) || isNaN(page) || isNaN(sort)) {
                return "El limite, la pagina y el sort deben ser numeros"
            }
            else {

                const products = await this.productService.consultarProductosService(limit, page, sort);
                if (products) {
                    const docs = products.docs
                    return docs
                }
                return "Error al buscar los productos"

            }

        }
        else {
            const products = await this.productService.consultarProductosService();
            const docs = products.docs
            return docs
        }

    }

    async constultarProductoPorIdController(req) {
        const id = req.params.id;
        const product = await this.productService.constultarProductoPorIdService(id);
        return product
    }

    async crearProductoController(req) {
        const product = req.body;
        const crearProd = await this.productService.crearProductoService(product);
        return crearProd

    }

    async actualizarProductoPorIdController(req) {
        const id = req.params.id;
        const actualizacion = req.body
        const product = await this.productService.actualizarProductoPorIdService(id, actualizacion);
        return product

    }

    async eliminarProductoPorIdController(req) {
        const id = req.params.id;
        const product = await this.productService.eliminarProductoPorIdService(id);
        return product
    }

}

