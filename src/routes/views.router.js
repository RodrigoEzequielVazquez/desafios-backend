import { Router } from "express";
import ProductController from "../controlador/products.controller.js";
import CartController from "../controlador/cart.controller.js";
import passport from "passport";
import { rolesMiddlewaresAdmin, rolesMiddlewaresUser } from "./middlewares/roles.middlewares.js";
import UserController from "../controlador/user.controller.js";
import TicketController from "../controlador/ticket.controller.js";

const router = Router()

const cartController = new CartController()
const productController = new ProductController()
const userController = new UserController()
const ticketController = new TicketController()

router.get("/products",passport.authenticate("jwt",{session:false}), async (req, res) => {

  const products = await productController.consultarProductosController(req,res,"view")
  
  let usuario = req.user

  res.render("products", { products, user: usuario, cart: usuario.cart })

})

router.get("/home",passport.authenticate("jwt",{session:false}), async (req, res) => {

  const products = await productController.consultarProductosController(req,res)
  res.render("home", { products })

})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
})

router.get('/cart/:cid', async (req, res) => {
  const cart = await cartController.consultarCartsPorIdController(req,res,"view")
  let products = JSON.parse(JSON.stringify(cart.products))

  console.log("productos lenght");
  console.log(products.length);

  if (products.length == 0) {
    return "no hay productos"
  }
  else{
    products.forEach((prod) => {
      prod.product.total = prod.product.price * prod.quantity
   })
 
   let totals = products.map(prod=>{
 return prod.product.total
   })
 
   let sumTotal = totals.reduce((a,b) =>{
     return a+b
   })
 
   console.log("por view");
    res.render('carts', {products, total:sumTotal, cart:cart._id})
  }

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

router.get("/requestResetPassword",(req,res) =>{
res.render("requestResetPassword")
})

router.get('/resetPassword',passport.authenticate("jwtRequestResetPassword", {session:false, failureRedicrec: "requestResetPassword"}),(req,res)=>{
  res.render('resetPassword');
})

router.get('/usersControl',passport.authenticate("jwt", {session:false}),rolesMiddlewaresAdmin,async (req,res)=>{
 
  const view = "admin"
  const users = await userController.getUsersController(view)
  res.render('usersControl',{users});

})

router.get('/ticket',passport.authenticate("jwt", {session:false}),async (req,res)=>{
 
  try {
    const lastTicket = await ticketController.getTicketController()
  
    const ticket = lastTicket[0]
  
    const products = lastTicket[0].products
    
    res.render('ticket',{ticket,products});
    
    } catch (error) {
      return next(error)
    }


})

export default router