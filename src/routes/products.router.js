import { Router } from "express"
import ProductManager from "../daos/mongodb/ProductManager.class.js";

const router = Router();

const productManager = new ProductManager()

router.get("/", async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filtro = req.query.filtro
    let filtroVal = req.query.filtroVal

    const products = await productManager.consultarProductos(limit,page,sort,filtro,filtroVal);
    res.send({ products });
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await productManager.consultarProductoPorId(id);
    res.send({ product });
});

router.post("/", async (req, res) => {
    console.log(req.body);
    const product = req.body;

    await productManager.crearProducto(product);
    const products = await productManager.consultarProductos()

    req.socketServer.sockets.emit("update-products", products)
    res.send({ status: "success" });
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const actualizacion = req.body
    const product = await productManager.actualizarProductoPorId(id, actualizacion);
    res.send({ product });
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await productManager.eliminarProductoPorId(id);
    res.send({ product });
});

export default router;