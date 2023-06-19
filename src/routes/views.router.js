import { Router } from "express";
import ProductManager from "../classes/ProductManager.class.js"

const productManager = new ProductManager()

const router = Router()

router.get("/", async (req,res) =>{
    const products = await productManager.consultarProductos(req.query.limit);
    console.log(products);
    res.render("home",{products})
    
})

export default router