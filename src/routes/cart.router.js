import { Router } from "express";
import ManagerCarts from "../daos/mongodb/CartManager.class.js";

const router = Router();
const managerCarts = new ManagerCarts();

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await managerCarts.consultarCartPorId(id);
  res.send(cart);
});

router.get("/", async (req, res) => {
  const carts = await managerCarts.consultarCarts();
  if(!carts){
    res.send("No se encontraron carritos")
  }
  res.send(carts);
});

router.post("/", async (req, res) => {
  await managerCarts.crearCart();
  res.send({ status: "success" });
});

router.post("/cart/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  await managerCarts.agregarProductoEnCarrito(cartId, productId);
  res.send({ status: "success" });
});

router.delete("/cart/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  await managerCarts.eliminarProductoEnCarrito(cartId, productId);
  res.send({ status: "success" });
});

export default router;