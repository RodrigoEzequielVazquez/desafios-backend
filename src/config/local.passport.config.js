import passport from "passport";
import local from "passport-local"
import GithubStrategy from "passport-github2";
import { createHash,isValidPassword } from "../utils.js";
import userModel from "../daos/mongodb/models/users.models.js";
import ManagerCarts from "../daos/mongodb/CartMongo.dao.js";
import config from "../../config.js";

export const intializePassportLocal = () => {

    const managerCarts = new ManagerCarts();

    const LocalStrategy = local.Strategy;
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
                const usuario = await userModel.findOne({ email: username });
        
                if (usuario) {
                    res.status(400).send({ status: "error", message: "usuario ya registrado" });
                    return done(null, false);
                } 

                const cart = await managerCarts.crearCart()

                if (email === config.adminEmail && password === config.adminPassword  ) {
                   
                    let nuevoUsuario = await userModel.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: "Admin",
                        cartId: cart.id
                    });

                    return done(null, nuevoUsuario);
                }

                if (email === config.premiumEmail && password === config.premiumPassword  ) {
                   
                    let nuevoUsuario = await userModel.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: "Premium",
                        cartId: cart.id
                    });

                    return done(null, nuevoUsuario);
                }

                else{
                    let nuevoUsuario = await userModel.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: "User",
                        cartId: cart.id
                    });
    
                    console.log(nuevoUsuario);
    
                    return done(null, nuevoUsuario);
                }

            } catch (error) {
                return done("Error al obtener el usuario " + error )
            }
            
        }
    ))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username,password,done) => {
        try{
            const usuario = await userModel.findOne({ email: username });
            
            if(!usuario) {
                console.log("El usuario no existe")
                return done(null, false);
            }
           
            if (!isValidPassword(password, usuario)) {
                return done("Contraseña invalida", null);
            }
            console.log(usuario);
            return done(null, usuario);
            
           
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("github", new GithubStrategy(
        {
            clientID: "Iv1.4941235288435e20",
            clientSecret: "270cd3d70a02fa688728054407763b05454ad011",
            callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {

               
                const cart = await managerCarts.crearCart()

                let newUser = {
                    first_name: profile._json.name,
                    last_name: "test lastname",
                    email: profile._json.email,
                    age: 25,
                    password: "1234",
                    role: "User",
                    cartId: cart.id
                };
                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, false);
            }
        }
    )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};