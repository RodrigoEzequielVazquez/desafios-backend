
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import UserService from "../services/user.service.js"
import { compareSync } from "bcrypt"
import { createHash } from "../utils.js";

const transport = nodemailer.createTransport({ service: "gmail", port: 587, auth: { user: "colo.202019@gmail.com", pass: "jgbohsuyqpxdpgpi" } })

export default class SessionController {

    constructor() {
        this.userService = new UserService()
    }

    async resetPasswordController(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: "error", error: "No ingreso email y/o contraseña" });
        }

        const user = await this.userService.findUserService(email)

        if (compareSync(password, user.password)) {
            console.log("misma password");
            return res.status(400).send({ status: "error", error: "La contraseña ingresada es igual a la anterior" });
            
        }
        const newHashedPassword = createHash(password);

        await this.userService.updatePasswordService(email, newHashedPassword)

        console.log("contraseña actualizada");

        return res.send({ status: "success", message: "Password updated" });

    }

    async requestResetPasswordController(req, res) {
        const email = req.body.email

        console.log(email);
        console.log("email sesions controller");

        if (!email) {
            return res.status(400).send({ status: "error", error: "El email no existe" })
        }

        const user = await this.userService.findUserService(email)
        if (!user) {
            return res.status(404).send({ status: "error" })
        }

        console.log(user);
        console.log("usuario sesions controller");

        let token = jwt.sign({ email }, "tokenReset", { expiresIn: "1h" })

        let result = await transport.sendMail({
            from: "colo.202019@gmail.com",
            to: email,
            subject: "Correo de recuperacion",
            html: `<div>
            <h1>Restaura tu email haciendo click en el siguiente link</h1>
            http://localhost:8080/resetPassword?token=${token}
            </div > `,
        })

        return res.send({ status: "success", message: "Contraseña actualizada" })

    }
}