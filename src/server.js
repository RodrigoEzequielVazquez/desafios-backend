import express from "express"
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io";

import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import viewsRouter from "./routes/views.router.js"
import sessionRouter from "./routes/session.router.js";

import ProductManager from "./daos/mongodb/ProductManager.class.js";
import CartManager from "./daos/mongodb/CartManager.class.js";
import MessageManager from "./daos/mongodb/MessagesManager.js";
import { intializePassportLocal } from "./config/local.passport.config.js";
import { initializePassportJWT } from "./config/jwt.passport.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express()

const connection = mongoose.connect(
    "mongodb+srv://rodrigovazquez99:BcKutvT3FsEJwAOL@cluster0.y15gbah.mongodb.net/?retryWrites=true&w=majority"
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"));

app.use(cookieParser())
initializePassportJWT()
intializePassportLocal()
app.use(passport.initialize())  

app.use(
    session({
      store: new MongoStore({
        mongoUrl:"mongodb+srv://rodrigovazquez99:BcKutvT3FsEJwAOL@cluster0.y15gbah.mongodb.net/?retryWrites=true&w=majority",
      }),
      secret: "mongoSecret",
      resave: true,
      saveUninitialized: false,
    }) 
  );
  

app.use(passport.session())  

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

const httpServer = app.listen(8080, () => {
    console.log("servidor iniciado");
})

const socketServer = new Server(httpServer)
const mensajes = [];
socketServer.on("connection", async (socket) => {
    console.log("Estas conectado " + socket.id)

    let productManager = new ProductManager()
    let cartManager = new CartManager
    
    socket.emit("update-products", await productManager.consultarProductos())

    socket.on("add-product", async (productData) => {
        await productManager.crearProducto(productData)
        socketServer.emit("update-products", await productManager.consultarProductos())
    })

    socket.on("delete-product", async (productID) => {
        await productManager.eliminarProductoPorId(productID)
        socketServer.emit("update-products", await productManager.consultarProductos())
    })

    socket.on("add-product-to-cart", async (productId) => {
 
        const cartId ="64a9f670770a9307d721f009"

        console.log(productId);

        if (cartId && productId) {
            
        await cartManager.agregarProductoEnCarrito(cartId,productId)
        }

    })

    let messageManager = new MessageManager()

    socket.on("message", async (data) => {
        console.log(data)
        await messageManager.crearChat(data)
        mensajes.push(data);
        socketServer.emit("imprimir", mensajes);
      });
    
      socket.on('authenticatedUser', (data)=>{
        socket.broadcast.emit('newUserAlert', data)
      })
})

app.use((req, res, next) => {
    req.socketServer = socketServer
    next()
})

app.use("/", viewsRouter)
app.use("/products", productRouter)
app.use("/carts", cartRouter)
app.use('/api/sessions', sessionRouter)