import { Router } from "express";
import CartController from "../controlador/cart.controller.js";
import passport from "passport";
import { verfircarPertenenciaCarrito } from "./middlewares/carts.middlewares.js";
import { rolesMiddlewaresUser } from "./middlewares/roles.middlewares.js";

const router = Router();

const cartController = new CartController()

router.get("/", async (req, res) => {
  const carts = await cartController.consultarCartsController()
  res.send(carts);
});

router.get("/:cid", async (req, res, next) => {
  try {
    console.log("por api");
    const cart = await cartController.consultarCartsPorIdController(req, res)

  } catch (error) {
    return next(error)
  }

});

router.post("/", async (req, res) => {
  await cartController.crearCartController();
  return res.send({status:"success", payload: "Carrito creado"}) 
});

//, rolesMiddlewaresUser
router.post("/:cid/product/:pid", passport.authenticate("jwt", { session: false }), verfircarPertenenciaCarrito, async (req, res, next) => {
  console.log("paso ruta")
  try {
    const result = await cartController.agregarProductoEnCarritoController(req, res);
    return result

  } catch (error) {
    return next(error)
  }


});

router.put("/:cid", async (req, res, next) => {

  try {
    const result = await cartController.actualizarCarritoController(req, res)

  } catch (error) {
    return next(error)
  }

})

router.put("/:cid/product/:pid", async (req, res, next) => {
  try {

    const result = await cartController.actualizarCantidadDelProductoController(req,res);   

  } catch (error) {
    return next(error)
  }


});

router.delete("/:cid/product/:pid", async (req, res, next) => {

  try {
    const result = await cartController.eliminarProductoEnCarritoController(req,res);
   
  } catch (error) {
    return next(error)
  }
 
});

router.delete("/:cid", async (req, res) => {
  const result = await cartController.eliminarTodosLosProductosController(req)
  res.send({ status: result });
});

router.post("/:cid/purchase", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const compra = await cartController.procesoDeCompra(req, res)
  return res.send({ status: "success" }).status(200);

});


export default router;
