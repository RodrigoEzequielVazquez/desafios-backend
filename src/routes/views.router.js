import { Router } from "express";
import ProductManager from "../daos/mongodb/ProductManager.class.js";
import CartManager from "../daos/mongodb/CartManager.class.js";

const productManager = new ProductManager()
const cartManager = new CartManager()
const router = Router()

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filtro = req.query.filtro;
  let filtroVal = req.query.filtroVal;
  console.log(limit,page,sort,filtro,filtroVal);

  if (limit || page || sort || filtro || filtroVal) {
    const products = await productManager.consultarProductos(limit, page, sort, filtro, filtroVal);
    res.render("home", { products })
  }
  else{
    const products = await productManager.consultarProductos();
    res.render("home", { products })
  
  }


})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
})

router.get('/cart/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.consultarCartPorId(cartId)
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
  res.render('profile', {
      user: req.session.user
  });
})


export default router