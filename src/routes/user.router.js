import { Router } from "express";
import { rolesMiddlewaresPremiumOuser } from "./middlewares/roles.middlewares.js";
import passport from "passport";
import UserController from "../controlador/user.controller.js";
import { uploader } from "../utils.js";

const router = Router();

const userController = new UserController()

//rolesMiddlewaresPremiumOuser,

router.put('/premium/:uid', passport.authenticate("jwt", { session: false }),  async (req, res, next) => {
    try {
       // const role = req.body.rol;
        const uid = req.params.uid;

        console.log("ruta inicial" );
        return await userController.cambiarRolController(uid, req, res)

    }
    catch (e) {
        next(e)
    }
})

router.post('/:uid/documents', uploader.fields([{name:"profiles"},{name:"products"},{name:"identificacion"},{name:"domicilio"},{name:"cuenta"}]), async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const files = req.files
        console.log(files)
         await userController.subirDocumentosController(uid, files)
        res.send({ status: "success", payload:`la imagen se envio de forma correcta` });
    } catch(e) {
        next(e)
    }
})

router.get('/', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
      
         const users = await userController.getUsersController(res)

         res.send({status:"succes", payload:users})

    }
    catch (e) {
        next(e)
    }
})

// passport.authenticate("jwt", { session: false })
router.delete('/inactiveusers/', async (req, res, next) => {
    try {
      
        return await userController.getInactiveUsersController(res)

    }
    catch (e) {
        next(e)
    }
})

router.delete('/delete/:email', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
      
        const email = req.params.email;

        console.log(email);
        res.send({status:"success"})
        return await userController.eliminarUserPorEmailController(email)
        

    }
    catch (e) {
        next(e)
    }
})

export default router