import { Router } from "express";
import CartController from "../controlador/cart.controller.js";
import passport from "passport";
import { verfircarPertenenciaCarrito } from "./middlewares/carts.middlewares.js";

const router = Router();

const cartController = new CartController()

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res,next) => {
  try {
    await cartController.consultarCartsController(res)
  } catch (error) {
    return next(error)
  }
 
});

router.get("/:cid", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {

  await cartController.consultarCartsPorIdController(req, res)

  } catch (error) {
    return next(error)
  }

});

router.post("/", passport.authenticate("jwt", { session: false }), async (req, res,next) => {
  try {

    await cartController.crearCartController(res);

  } catch (error) {
    return next(error)
  }

 
});

router.post("/:cid/product/:pid", passport.authenticate("jwt", { session: false }), verfircarPertenenciaCarrito, async (req, res, next) => {
  try {
     await cartController.agregarProductoEnCarritoController(req, res);
   
  } catch (error) {
    return next(error)
  }

});

router.put("/:cid", passport.authenticate("jwt", { session: false }), verfircarPertenenciaCarrito, async (req, res, next) => {

  try {
    await cartController.actualizarCarritoController(req, res)

  } catch (error) {
    return next(error)
  }

})

router.put("/:cid/product/:pid", passport.authenticate("jwt", { session: false }), verfircarPertenenciaCarrito, async (req, res, next) => {
  try {

    const result = await cartController.actualizarCantidadDelProductoController(req,res);   

  } catch (error) {
    return next(error)
  }


});

router.delete("/:cid/product/:pid", passport.authenticate("jwt", { session: false }), verfircarPertenenciaCarrito, async (req, res, next) => {

  try {
    await cartController.eliminarProductoEnCarritoController(req,res);
   
  } catch (error) {
    return next(error)
  }
 
});

router.delete("/:cid", passport.authenticate("jwt", { session: false }), verfircarPertenenciaCarrito, async (req, res, next) => {

  try {
    const result = await cartController.eliminarTodosLosProductosController(req,res)
 
  } catch (error) {
    return next(error)
  }
});

router.post("/:cid/purchase", passport.authenticate("jwt", { session: false }),verfircarPertenenciaCarrito, async (req, res,next) => {
  try {
    const compra = await cartController.procesoDeCompra(req, res)
 
  } catch (error) {
    return next(error)
  }

});


export default router;
