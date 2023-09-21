import { Router } from "express"
import { generarProductos } from "../utils.js"

const router = Router()

router.get("/mockingproducts", async (req,res) =>{
    let productos = []
    for (let index = 0; index < 100; index++) {
        productos.push(generarProductos())
    }
    res.send({status:"success", payload: productos})
})

export default router

