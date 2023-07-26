import { Router } from "express";
import userModel from "../daos/mongodb/models/users.models.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exist = await userModel.findOne({ email });

    if (exist)
        return res
            .status(400)
            .send({ status: "error", message: "usuario ya registrado" });

    let result = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password,
    });
    res.send({ status: "success", message: "usuario  registrado" });

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await userModel.findOne({ email: email, password: password });
    console.log(user)
    if (user) {

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            req.session.user = {
                name: user.first_name + " " + user.last_name,
                email: user.email,
                age: user.age,
                role: "Admin"
            };
            res.send({ status: "success", message: req.session.user });
        }
        else{
            req.session.user = {
                name: user.first_name + " " + user.last_name,
                email: user.email,
                age: user.age,
                role: "User"
            };
            res.send({ status: "success", message: req.session.user });
        }
    }
    else return res.status(400).send({status: "error", error: "error al ingresar con ese usuario"})

});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.json({status: "logout error", body: err})
      }
      res.send("Logout realizado")
    })
  })

export default router