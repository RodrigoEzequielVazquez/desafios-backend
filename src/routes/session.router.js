import { Router } from "express";
import jwt from "jsonwebtoken"
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate("register",{session:false}), async (req, res) => {
 
    res.send({ status: "success", message: "usuario  registrado" });

});

router.get("/failregister", async(req,res) =>{
console.log("Registro Fallido");
res.send({error:"Error"})
})

router.post("/login", passport.authenticate("login",{session: false}), async (req, res) => {
   
    let token = jwt.sign({ email: req.body.email }, "coderSecret", {
        expiresIn: "24h",
      });
      res.cookie("coderCookie", token, { httpOnly: true }).send({ status: "success" });
   
    // if (!req.user) {
    //     return res.status(400).send({status:"error",error:"Datos invalidos"})   
    // }
    //     if (req.user.email === "adminCoder@coder.com") {
    //         req.session.user = {
    //             name: req.user.first_name + " " + req.user.last_name,
    //             email: req.user.email,
    //             age: req.user.age,
    //             role: "Admin"
    //         };
    //         res.send({ status: "success", message: req.session.user });
    //     }
    //     else {
    //         req.session.user = {
    //             name: req.user.first_name + " " + req.user.last_name,
    //             email: req.user.email,
    //             age: req.user.age,
    //             role: "User"
    //         };
    //         res.send({ status: "success", payload: req.user });
    //     }

});

router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) =>{
    res.send(req.user)
})

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