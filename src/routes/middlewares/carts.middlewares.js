export const verfircarPertenenciaCarrito = (req, res, next) => {

   if (req.user.cart == req.params.cid) {
      next()
   }
   else {
      res.send("El carrito no corresponde al usuario, no es posible realizar la accion")
   }

}

