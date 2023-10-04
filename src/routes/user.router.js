import { Router } from "express";
import { rolesMiddlewaresPremiumOuser } from "./middlewares/roles.middlewares.js";
import passport from "passport";
import UserController from "../controlador/user.controller.js";

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

export default router