import ProductDAO from "../daos/mongodb/ProductMongo.dao.js";
import ProductService from "../services/product.service.js";
import { ErrorEnum } from "../services/errors/enums.js";
import { generateErrorId, generateErrorProductInfo, generateErrorActualizarProductInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.class.js";

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

    async constultarProductoPorIdController(req,res) {

        const id = req.params.id;
        console.log(id.length);
        if (id.length != 24) {
            console.log(id.length);
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id,"producto"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }
        else{
            console.log(id.length);
            const product = await this.productService.constultarProductoPorIdService(id);
            res.send({status:"success", payload: product});
            console.log(product);
            console.log("controlador");
        }
    }

    async crearProductoController(req,res) {
        const product = req.body;
        console.log("en el body");
        console.log(product);
            if (!product.title || !product.price || !product.stock || !product.category || !product.description ) {
                CustomError.createError({
                    name: "Faltan datos",
                    cause: generateErrorProductInfo(product),
                    message: "No completaste todos los campos requeridos para crear el producto",
                    code: ErrorEnum.DATA_ERROR
                }) 
            }
            if (req.user.rol === "Premium") {
                product.owner = req.user.email
            }
            console.log("agregando campo owner");
            console.log(product);

        const crearProd = await this.productService.crearProductoService(product);
        return res.send({status:"success", payload: crearProd}) 

    }

    async actualizarProductoPorIdController(req,res) {
        
        const id = req.params.id;
        const product = req.body

        if (id.length != 24) {
            console.log(id.length);
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }

        if (!product.title && !product.price && !product.stock && !product.category && !product.description ) {
            CustomError.createError({
                name: "Faltan datos",
                cause: generateErrorActualizarProductInfo(product),
                message: "No ingresaste ningun campo valido para actualizar",
                code: ErrorEnum.DATA_ERROR
            }) 
        }

        const producto = await this.productService.constultarProductoPorIdService(id)
        
        if (req.user.rol == "Admin" && producto.owner == "Admin" ) {
            const actualizacion = await this.productService.actualizarProductoPorIdService(id, product);
            return  res.send({ actualizacion });
        }

        if (req.user.rol == "Premium" && producto.owner == req.user.email) {
            const actualizacion = await this.productService.actualizarProductoPorIdService(id, product);
            return  res.send({ actualizacion });
        }

        else{
            return "No podes actualizar un producto que no te corresponde"
        }

    }

    async eliminarProductoPorIdController(req,res) {
        const id = req.params.id;

        if (id.length != 24) {
            console.log(id.length);
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })    
        }

        const producto = await this.productService.constultarProductoPorIdService(id)

        if (req.user.rol == "Admin") {
            const product = await this.productService.eliminarProductoPorIdService(id);
            return res.send({status:"success", payload: product})
    
        }

        if (req.user.rol == "Premium" && producto.owner == req.user.email) {
            const product = await this.productService.eliminarProductoPorIdService(id);
            return res.send({status:"success", payload: product})
        }

        else{
            return res.send({status:"error", payload: "no podes eliminar un producto que no te corresponde"})
        }
 
    }

}

