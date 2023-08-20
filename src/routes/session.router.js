import { Router } from "express";
import passport from "passport";
import { userController } from "../controlador/session.controller.js";

const router = Router();

router.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}), async (req, res) => {
 
    res.send({ status: "Success", message: "Usuario  registrado" });

});

router.get("/failregister", async(req,res) =>{
console.log("Registro Fallido");
res.send({error:"Error"})
})

router.post("/login", passport.authenticate("login",{failureRedirect:"/faillogin"}), async (req, res) => {
    
    const usuario = req.user
    userController(usuario,req,res)

});

router.get("/faillogin", (req,res) =>{
    res.send({error:"Login fallido"})
})

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: "logout error", body: err })
        }
        res.send("Logout realizado")
    })
})

router.get("/github", passport.authenticate("github",{scope:"user:email"}),async(req,res) =>{

})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect: "/login"}),async(req,res) =>{
    req.session.user = req.user
    res.redirect("/")
})

export default router