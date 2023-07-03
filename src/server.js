import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io";

import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import viewsRouter from "./routes/views.router.js"

import ProductManager from "./daos/mongodb/ProductManager.class.js";
import MessageManager from "./daos/mongodb/MessagesManager.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + "/public"));

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

    socket.emit("update-products", await productManager.consultarProductos())

    socket.on("add-product", async (productData) => {
        await productManager.crearProducto(productData)
        socketServer.emit("update-products", await productManager.consultarProductos())
    })

    socket.on("delete-product", async (productID) => {
        await productManager.eliminarProductoPorId(productID)
        socketServer.emit("update-products", await productManager.consultarProductos())
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