import { Router } from "express"
import ProductManager from "../daos/mongodb/ProductManager.class.js";
import { actualizarProductoPorIdController, constultarProductoPorIdController, consultarProductosController, crearProductoController, eliminarProductoPorIdController } from "../controlador/products.controller.js";


const router = Router();

const productManager = new ProductManager()

router.get("/", async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filtro = req.query.filtro
    let filtroVal = req.query.filtroVal
   
    const docs = await consultarProductosController(limit,page,sort,filtro,filtroVal);
    res.send({ docs });
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await constultarProductoPorIdController(id);
    res.send({ product });
});

router.post("/", async (req, res) => {
    const product = req.body;
    await crearProductoController(product);

    //productos en tiempo real
    const products = await productManager.consultarProductos()
    req.socketServer.sockets.emit("update-products", products)
    res.send({ status: "success" });
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const actualizacion = req.body
    const product = await actualizarProductoPorIdController(id, actualizacion);
    res.send({ product });
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await eliminarProductoPorIdController(id);
    res.send({ product });
});

export default router;