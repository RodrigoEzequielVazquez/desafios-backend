import { Router } from "express";
import ProductController from "../controlador/products.controller.js";
import CartController from "../controlador/cart.controller.js";
import passport from "passport";
import { rolesMiddlewaresUser } from "./middlewares/roles.middlewares.js";

const router = Router()

const cartController = new CartController()
const productController = new ProductController()

router.get("/",passport.authenticate("jwt",{session:false}), async (req, res) => {

  const products = await productController.consultarProductosController(req)
  console.log("productos");
  let usuario = req.user
  console.log(usuario);
  console.log("view");
  res.render("home", { products, user: usuario })

})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
})

router.get('/cart/:cid', async (req, res) => {
  const cart = await cartController.consultarCartsPorIdController(req)
  const products = cart.products
  console.log(products);
  res.render('carts', {
    products: JSON.parse(JSON.stringify(products))})
})

router.get('/chat',passport.authenticate("jwt",{session:false}),rolesMiddlewaresUser, (req, res) => {
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