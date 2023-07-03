import { Router } from "express";
import ProductManager from "../daos/mongodb/ProductManager.class.js";

const productManager = new ProductManager()

const router = Router()

router.get("/", async (req, res) => {
  const products = await productManager.consultarProductos(req.query.limit);
  console.log(products);
  res.render("home", { products })

})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
})

router.get('/chat', (req, res) => {
  res.render('messages');

})

export default router