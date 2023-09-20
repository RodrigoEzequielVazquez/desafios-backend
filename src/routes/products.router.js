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

router.get("/:id", async (req, res) => {
    const product = await productController.constultarProductoPorIdController(req);
    res.send({ product });
});

router.post("/",passport.authenticate("jwt",{session:false}),rolesMiddlewaresAdmin, async (req, res) => {

    console.log(req.user);
    console.log("ok");
    
    await productController.crearProductoController(req);

    //productos en tiempo real
    const products = await productDao.consultarProductos()
    req.socketServer.sockets.emit("update-products", products)
    res.send({ status: "success" });
});

router.put("/:id",passport.authenticate("jwt",{session:false}),rolesMiddlewaresAdmin, async (req, res) => {
    const product = await productController.actualizarProductoPorIdController(req);
    res.send({ product });
});

router.delete("/:id",passport.authenticate("jwt",{session:false}),rolesMiddlewaresAdmin, async (req, res) => {
    const product = await productController.eliminarProductoPorIdController(req);
    res.send({ product });
});

export default router;