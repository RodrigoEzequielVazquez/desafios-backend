import passport from "passport";
import local from "passport-local"
import GithubStrategy from "passport-github2";
import userModel from "../daos/mongodb/models/users.models.js";
import ManagerCarts from "../daos/mongodb/CartManager.class.js";
import config from "../../config.js";
import { loginController, registerController } from "../controlador/session.controller.js";

export const intializePassport = () => {

     const managerCarts = new ManagerCarts();

    const LocalStrategy = local.Strategy;
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;

            try {
                
               registerController(first_name,last_name,email,age,password,done)
                
              
            } catch (error) {
                return done("Error al obtener el usuario " + error )
            }
            
        }
    ))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username,password,done) => {

      
        try{

            loginController(username,password,done)
           
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("github", new GithubStrategy(
        {
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackURL,
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
                    password: config.passwordGithub,
                    role: "user",
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