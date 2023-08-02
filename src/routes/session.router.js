import { Router } from "express";
import userModel from "../daos/mongodb/models/users.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}), async (req, res) => {
 
    res.send({ status: "success", message: "usuario  registrado" });

});

router.get("/failregister", async(req,res) =>{
console.log("Registro Fallido");
res.send({error:"Error"})
})

router.post("/login", passport.authenticate("login",{failureRedirect:"/faillogin"}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({status:"error",error:"Datos invalidos"})
        
    }

        if (req.user.email === "adminCoder@coder.com" && req.user.password === "adminCod3r123") {
            req.session.user = {
                name: req.user.first_name + " " + req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: "Admin"
            };
            res.send({ status: "success", message: req.session.user });
        }
        else {
            req.session.user = {
                name: req.user.first_name + " " + req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: "User"
            };
            res.send({ status: "success", message: req.session.user });
        }

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
    console.log("exito");
    req.session.user = req.user
    res.redirect("/")
})

export default router