import { Router } from "express";
import { consultarProductosController } from "../controlador/products.controller.js";
import { consultarCartsPorIdController } from "../controlador/cart.controller.js";

const router = Router()

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filtro = req.query.filtro;
  let filtroVal = req.query.filtroVal;
 // console.log(limit,page,sort,filtro,filtroVal);

 const products = await consultarProductosController(limit,page,sort,filtro,filtroVal);
 console.log(products);
  res.render("home", { products, user: req.session.user })

})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
})

router.get('/cart/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await consultarCartsPorIdController(cartId)
  const products = cart.products
  console.log(products);
  res.render('carts', {
    products: JSON.parse(JSON.stringify(products))})
})

router.get('/chat', (req, res) => {
  res.render('messages');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/profile', (req, res) => {
  console.log(req.session.user);
  res.render('profile', {user: req.session.user });
})


export default router