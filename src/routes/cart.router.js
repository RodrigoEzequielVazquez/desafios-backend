import { Router } from "express";
import { actualizarCarritoController, agregarProductoEnCarritoController, consultarCartsController, consultarCartsPorIdController, crearCartController, eliminarProductoEnCarritoController,eliminarTodosLosProductosController } from "../controlador/cart.controller.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await consultarCartsPorIdController(id)
  res.send(cart);
});

router.get("/", async (req, res) => {
  const carts = await consultarCartsController()
  res.send(carts);
});

router.post("/", async (req, res) => {
  await crearCartController();
  res.send({ status: "success" });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const result =  await agregarProductoEnCarritoController(cartId, productId);
  res.send({ status: result });
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const result = await eliminarProductoEnCarritoController(cartId, productId);
  res.send({ status: result });
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const result = await eliminarTodosLosProductosController(cartId)
  res.send({ status: result });
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const arrProducts = req.body
  const result = await actualizarCarritoController(cartId, arrProducts)
  res.send({ status: result });
})

router.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = Number (req.body.quantity)
  const result = await actualizarCantidadDelProductoController(cartId, productId,quantity);
  res.send({ status: result });
});

export default router;
