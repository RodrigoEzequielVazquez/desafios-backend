import UserDAO from "../daos/mongodb/UserMongo.dao.js"
import jwt from "jsonwebtoken"

export default class UserService {

    constructor() {
        this.userDAO = new UserDAO
    }

    async findUserService(email) {
        let user = await this.userDAO.findUser(email)

        return user
    }

    async updatePasswordService(email, newPassword) {
        await this.userDAO.updatePassword(email, newPassword)
    }

    async cambiarRolService(uid, role, email,res) {

        const usuario = await this.findUserService(email)
        console.log(usuario);

        let user = {
            id: usuario._id,
            nombre: usuario.first_name,
            apellido: usuario.last_name,
            email: usuario.email,
            edad: usuario.age,
            contraseña: usuario.password,
            rol: usuario.role,
            cart: usuario.cartId
        }
        let token = jwt.sign(user, "coderSecret", { expiresIn: "24h", });

        res.cookie("coderCookie", token, { httpOnly: true })

        await this.userDAO.cambiarRol(uid, role)
    }
}


