import { Router } from "express"
import ProductManager from "../classes/ProductManager.class.js"

const router = Router();

const productManager = new ProductManager()

router.get("/", async (req, res) => {
    //  console.log(req.query.limit);
    const products = await productManager.consultarProductos(req.query.limit);
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

    productManager.crearProducto(product);
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