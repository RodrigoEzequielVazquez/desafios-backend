import ProductDAO from "../daos/mongodb/ProductMongo.dao.js";
import ProductService from "../services/product.service.js";
import { ErrorEnum } from "../services/errors/enums.js";
import { generateErrorId, generateErrorProductInfo, generateErrorActualizarProductInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.class.js";
import nodemailer from "nodemailer"
import config from "../../config.js";

const transport = nodemailer.createTransport({ service: config.transporService, port: config.transportPass, auth: { user: config.emailFrom, pass: config.transportPass } })

export default class ProductController {

    constructor() {
        this.productService = new ProductService()
        this.productDAO = new ProductDAO()
    }

    async consultarProductosController(req, res, view) {
        let limit = Number(req.query.limit)
        let page = Number(req.query.page)
        let sort = Number(req.query.sort)
        let filtro = req.query.filtro
        let filtroVal = req.query.filtroVal

        if (limit || page || sort || filtro || filtroVal) {

            if (isNaN(limit) || isNaN(page) || isNaN(sort)) {
                return res.send({ status: "error", payload: "Los filtros de limite,pagina y orden, deben ser especificados en numero" })
            }
            else {
                let whereOptions = {};
                if (filtro != "" && filtroVal != "") {
                    whereOptions = { [filtro]: filtroVal };

                    const products = await this.productService.consultarProductosService(limit, page, sort,whereOptions);
                    const docs = products.docs
                    console.log(docs.length);
                    if (docs && docs.length > 0) {
                        if (view == "view") {
                            return docs
                        }
                        else{
                            res.send({ status: "success", payload: docs });
                        }
                       
                    }
                    else {
                        return res.send({ status: "error", payload: "No hay productos para mostrar" });
                    }
                }

                else{
                    const products = await this.productService.consultarProductosService(limit, page, sort);
                    const docs = products.docs
                    if (docs && docs.length > 0) {
                        if (view == "view") {
                            return docs
                        }
                        else{
                            res.send({ status: "success", payload: docs });
                        }
                    }
                    else {
                        return res.send({ status: "error", payload: "No hay productos para mostrar" });
                    }
                }

               
            }
        }
        else {
            const products = await this.productService.consultarProductosService();
            const docs = products.docs
            if (docs && docs.length > 0) {
                if (view == "view") {
                    return docs
                }
                else{
                    res.send({ status: "success", payload: docs });
                }
            }
            else {
                return res.send({ status: "error", payload: "No hay productos para mostrar" });
            }
        }

    }

    async constultarProductoPorIdController(req, res) {

        const id = req.params.id;
    
        if (id.length != 24) {
    
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id, "producto"),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })
        }
        else {
            
            const product = await this.productService.constultarProductoPorIdService(id);
            if (product) {
                res.send({ status: "success", payload: product });
            }
            else{
                res.send({ status: "error", payload: "No hay productos con el id " + id });
            }
            
          
        }
    }

    async crearProductoController(req, res) {
        const product = req.body;
        if (!product.title || !product.price || !product.stock || !product.category || !product.description) {

            CustomError.createError({
                name: "Faltan datos",
                cause: generateErrorProductInfo(product),
                message: "No completaste todos los campos requeridos para crear el producto",
                code: ErrorEnum.DATA_ERROR
            })

        }
        // si es premium, el campo owner es su email, si no por default es "admin"
        if (req.user.rol === "Premium") {
            product.owner = req.user.email
        }

        const crearProd = await this.productService.crearProductoService(product);
        if (crearProd) {
            return res.send({ status: "success", payload: crearProd })
        }


    }

    async actualizarProductoPorIdController(req, res) {

        const id = req.params.id;
        const product = req.body

        if (id.length != 24) {
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })
        }

        if (!product.title && !product.price && !product.stock && !product.category && !product.description) {
            CustomError.createError({
                name: "Faltan datos",
                cause: generateErrorActualizarProductInfo(product),
                message: "No ingresaste ningun campo valido para actualizar",
                code: ErrorEnum.DATA_ERROR
            })
        }

        const producto = await this.productService.constultarProductoPorIdService(id)

        if(producto){
            if (req.user.rol == "Admin" ) {
                const actualizacion = await this.productService.actualizarProductoPorIdService(id, product);
                return res.send({status:"success", payload: "El producto se actualizo correctamente" });
            }
    
            if (req.user.rol == "Premium" && producto.owner == req.user.email) {
                const actualizacion = await this.productService.actualizarProductoPorIdService(id, product);
                return res.send({status:"success", payload: "El producto se actualizo correctamente" });
            }
    
            else {
                return res.send({ status: "error", payload: "no podes eliminar un producto que no te corresponde" })
            }
    
        }
        else{
            res.send({ status: "error", payload: "No hay productos con el id " + id });
        }

      
    }

    async eliminarProductoPorIdController(req, res) {
        const id = req.params.id;

        if (id.length != 24) {
            CustomError.createError({
                name: "Id invalido",
                cause: generateErrorId(id),
                message: "El id debe tener exactamente 24 digitos",
                code: ErrorEnum.INVALID_ID
            })
        }

        const producto = await this.productService.constultarProductoPorIdService(id)

        if (producto) {
          
        if (req.user.rol == "Admin") {
            const product = await this.productService.eliminarProductoPorIdService(id);
            return res.send({ status: "success", payload: "El producto se elimino correctamente"})
        }

        if (req.user.rol == "Premium" && producto.owner == req.user.email) {
            const product = await this.productService.eliminarProductoPorIdService(id);
            let result = transport.sendMail({
                from: config.emailFrom,
                to: req.user.email,
                subject: "Producto eliminado",
                html: `<div>
                <h1>El producto ${producto.title} fue eliminado correctamente.</h1></div > `,
            })
            return res.send({ status: "success", payload: "El producto se elimino correctamente, en breve llegara un aviso a tu correo sobre el producto que eliminaste"  })
        }

        else {
            return res.send({ status: "error", payload: "no podes eliminar un producto que no te corresponde" })
        }

    }
    else{
        res.send({ status: "error", payload: "No hay productos con el id " + id });
    }

    }

}

