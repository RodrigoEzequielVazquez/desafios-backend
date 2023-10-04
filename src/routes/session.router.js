import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken"
import { CurrentUserDTO } from "../controlador/DTO/user.dto.js";
import SessionController from "../controlador/session.controller.js";

const router = Router();

const sessionController = new SessionController()

router.post("/register", passport.authenticate("register",{session:false}), async (req, res) => {
 
    res.send({ status: "success", message: "usuario  registrado" });

});

// router.get("/failregister", async(req,res) =>{
// console.log("Registro Fallido");
// res.send({error:"Error"})
// })

router.post("/login", passport.authenticate("login",{ session: false }), async (req, res) => {
    console.log(req.user);
    let user = {
        id:req.user._id,
        nombre:req.user.first_name,
        apellido:req.user.last_name,
        email:req.user.email,
        edad:req.user.age,
        contraseña:req.user.password,
        rol:req.user.role,
        cart:req.user.cartId
    }
    let token = jwt.sign( user , "coderSecret", {
        expiresIn: "24h",
      });
      res.cookie("coderCookie", token, { httpOnly: true }).send({ status: "success" });
});

// router.get("/faillogin", (req,res) =>{
//     res.send({error:"Login fallido"})
// })

router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) =>{
    res.send(new CurrentUserDTO(req.user))
})

// router.get("/logout", (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.json({ status: "logout error", body: err })
//         }
//         res.send("Logout realizado")
//     })
// })

router.post("/resetPassword",async(req,res) =>{
    await sessionController.resetPasswordController(req,res)
    
})

router.post("/requestResetPassword",async(req,res) =>{
    await sessionController.requestResetPasswordController(req,res)
    
})

router.get("/github", passport.authenticate("github",{scope:"user:email"}),async(req,res) =>{
})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect: "/login"}),async(req,res) =>{
    req.session.user = req.user
    res.redirect("/")
})

export default router