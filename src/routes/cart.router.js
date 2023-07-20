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

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  await managerCarts.agregarProductoEnCarrito(cartId, productId);
  res.send({ status: "success" });
  console.log("error");
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  await managerCarts.eliminarProductoEnCarrito(cartId, productId);
  res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  await managerCarts.eliminarTodosLosProductos(cartId)
  res.send({ status: "success" });
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const arrProducts = req.body
  await managerCarts.actualizarCarrito(cartId, arrProducts)
  res.send({ status: "success" });
})

router.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = Number (req.body.quantity)
  await managerCarts.actualizarCantidadDelProducto(cartId, productId,quantity);
  res.send({ status: "success" });
});

export default router;