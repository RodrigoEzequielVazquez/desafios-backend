import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken"

const router = Router();

router.post("/register", passport.authenticate("register",{session:false}), async (req, res) => {
 
    res.send({ status: "success", message: "usuario  registrado" });

});

// router.get("/failregister", async(req,res) =>{
// console.log("Registro Fallido");
// res.send({error:"Error"})
// })

router.post("/login", passport.authenticate("login",{failureRedirect:"/faillogin"}), async (req, res) => {
    let token = jwt.sign({ email: req.body.email }, "coderSecret", {
        expiresIn: "24h",
      });
      res.cookie("coderCookie", token, { httpOnly: true }).send({ status: "success" });

});

// router.get("/faillogin", (req,res) =>{
//     res.send({error:"Login fallido"})
// })

router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) =>{
    res.send(req.user)
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