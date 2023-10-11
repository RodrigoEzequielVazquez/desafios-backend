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

router.post('/:uid/documents', uploader("documents").fields([{name:"identificacion", maxCount: 1},{name:"domicilio", maxCount: 1},{name:"estado de cuenta", maxCount: 1}]), async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const files = req.files
        console.log(files)
        await userController.subirDocumentosController(uid, files)
        res.send({ status: "success" });
    } catch(e) {
        next(e)
    }
})

export default router