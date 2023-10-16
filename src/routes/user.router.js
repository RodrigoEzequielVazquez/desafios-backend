import { Router } from "express";
import { rolesMiddlewaresPremiumOuser } from "./middlewares/roles.middlewares.js";
import passport from "passport";
import UserController from "../controlador/user.controller.js";
import { uploader } from "../utils.js";

const router = Router();

const userController = new UserController()

router.put('/premium/:uid', passport.authenticate("jwt", { session: false }), rolesMiddlewaresPremiumOuser, async (req, res, next) => {
    try {
        const role = req.body.rol;
        const uid = req.params.uid;

        console.log(role, uid);

        return await userController.cambiarRolController(uid, role, req, res)

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

export default router