import { Router } from "express"
import ProductController from "../controlador/products.controller.js";
import ProductDAO from "../daos/mongodb/ProductMongo.dao.js";
import passport from "passport";
import { rolesMiddlewaresAdmin } from "./middlewares/roles.middlewares.js";

const router = Router();

const productDao = new ProductDAO()
const productController = new ProductController()

router.get("/", async (req, res) => {
    const products = await productController.consultarProductosController(req);
    res.send({ products });
});

router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
try {
    const product = await productController.constultarProductoPorIdController(req, res);
} catch (error) {
    return next(error)
}
    
});
// ,rolesMiddlewaresAdmin
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        console.log(req.user);
        console.log("ok");

        await productController.crearProductoController(req, res);

        //productos en tiempo real
        const products = await productDao.consultarProductos()
        req.socketServer.sockets.emit("update-products", products)

    } catch (error) {
        return next(error)
    }

});
//, rolesMiddlewaresAdmin

router.put("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const product = await productController.actualizarProductoPorIdController(req,res);
       
    } catch (error) {
        return next(error)
    }
   
});

//, rolesMiddlewaresAdmin

router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {

    try {
        const product = await productController.eliminarProductoPorIdController(req,res);
    } catch (error) {
        return next(error)
    }
   
});

export default router;