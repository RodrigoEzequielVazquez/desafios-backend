import dotenv from "dotenv"

dotenv.config()

export default {
    port:process.env.PORT,
    mongoURL:process.env.MONGO_URL,
    mongoSecret:process.env.MONGO_SECRET,
    adminEmail:process.env.ADMIN_EMAIL,
    adminPassword:process.env.ADMIN_PASSWORD,
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL,
    passwordGithub:process.env.PASSWORD_GITHUB,
    secretOrKey:process.env.SECRET_OR_KEY,
    environment:process.env.ENVIRONMENT
}