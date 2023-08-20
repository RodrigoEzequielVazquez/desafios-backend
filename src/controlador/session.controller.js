import ManagerCarts from "../daos/mongodb/CartManager.class.js";
import userModel from "../daos/mongodb/models/users.models.js";
import { createHash,isValidPassword } from "../utils.js";
import config from "../../config.js";

const managerCarts = new ManagerCarts();

export const registerController = async (first_name, last_name, email, age, password,done) => {

    const exist = await userModel.findOne({ email });
        
    if (exist) {
        res.status(400).send({ status: "error", message: "usuario ya registrado" });
        return done(null, result);
    }    
    else{
        const cart = await managerCarts.crearCart()

        let result = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartId: cart.id
        });
        return done(null, result);

    }
  
}

export const loginController = async (username,password,done) => {

    const user = await userModel.findOne({ email: username });
 
    if(!user) {
        console.log("El usuario no existe")
        return done(null, false);
    }
    else{
        if (!isValidPassword(password, user)) return done(null, false);
        console.log(user, 'user login')
        return done(null, user);
    }
   
}

export const userController = async (usuario,req,res) => {

    if (!usuario) {
        return res.status(400).send({status:"error",error:"Datos invalidos"}) 
    }
    else{
        if (usuario.email === config.adminEmail) {
            req.session.user = {
                name: usuario.first_name + " " + usuario.last_name,
                email: usuario.email,
                age: usuario.age,
                role: "Admin"
            };
            res.send({ status: "success", message: req.session.user });
            console.log("se valido por Admin");
        }
        else {
            req.session.user = {
                name: usuario.first_name + " " + usuario.last_name,
                email: usuario.email,
                age: usuario.age,
                role: "User"
            };
            res.send({ status: "success", message: req.session.user });
            console.log("se valido por user" + usuario.email + usuario.password);
        }
    }
}