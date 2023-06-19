import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import viewsRouter from "./routes/views.router.js"

const app = express()

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', viewsRouter)
app.use('/products/', productRouter)
app.use('/carts/', cartRouter)

app.listen(8080, () =>{
    console.log("servidor iniciado");
})