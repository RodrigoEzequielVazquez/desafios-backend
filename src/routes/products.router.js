import { Router } from "express"
import ProductController from "../controlador/products.controller.js";
import ProductDAO from "../daos/mongodb/ProductMongo.dao.js";
import passport from "passport";
import { rolesMiddlewaresAdmin, rolesMiddlewaresPremiumOAdmin } from "./middlewares/roles.middlewares.js";

const router = Router();

const productDao = new ProductDAO()
const productController = new ProductController()

router.get("/", async (req, res, next) => {
    try {
    
       return await productController.consultarProductosController(req,res);
   
       
    } catch (error) {
        return next(error)
    }
   
});

router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
try {
    return await productController.constultarProductoPorIdController(req, res);
} catch (error) {
    return next(error)
}
    
});

router.post("/", passport.authenticate("jwt", { session: false }),rolesMiddlewaresPremiumOAdmin, async (req, res, next) => {
    try {
    
        await productController.crearProductoController(req, res);

        //productos en tiempo real
        const products = await productDao.consultarProductos()
        req.socketServer.sockets.emit("update-products", products)

    } catch (error) {
        return next(error)
    }

});

router.put("/:id", passport.authenticate("jwt", { session: false }),rolesMiddlewaresPremiumOAdmin, async (req, res, next) => {
    try {
         await productController.actualizarProductoPorIdController(req,res);
       
    } catch (error) {
        return next(error)
    }
   
});

router.delete("/:id", passport.authenticate("jwt", { session: false }),rolesMiddlewaresPremiumOAdmin, async (req, res, next) => {

    try {
         await productController.eliminarProductoPorIdController(req,res);
    } catch (error) {
        return next(error)
    }
   
});

export default router;