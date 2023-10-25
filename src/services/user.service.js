import UserDAO from "../daos/mongodb/UserMongo.dao.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import config from "../../config.js";

const transport = nodemailer.createTransport({ service: config.transporService, port: config.transportPass, auth: { user: config.emailFrom, pass: config.transportPass } })

export default class UserService {

    constructor() {
        this.userDAO = new UserDAO
    }

    async findUserService(id) {
        let user = await this.userDAO.findUser(id)

        return user
    }

    async updatePasswordService(email, newPassword) {
        await this.userDAO.updatePassword(email, newPassword)
    }

    async cambiarRolService(uid, res) {

        const usuario = await this.findUserService(uid)
     
        if (usuario) {

            if (usuario.role == "Admin") {
                return "no se puede cambiar ese tipo de usuario"
            }
 
            if (usuario.role === "User") {
                const documents = usuario.documents.filter(doc => [
                    "identificacion",
                    "domicilio",
                    "cuenta"
                ].includes(doc.name.split('.')[0]))

                if (documents.length < 3) {

                    return res.send({ status: "error", payload: "Debe ingresar todos los documentos" })
                }

                let user = {
                    id: usuario._id,
                    nombre: usuario.first_name,
                    apellido: usuario.last_name,
                    email: usuario.email,
                    edad: usuario.age,
                    contraseña: usuario.password,
                    rol: "Premium",
                    cart: usuario.cartId
                }
                let token = jwt.sign(user, "coderSecret", { expiresIn: "24h", });

                res.cookie("coderCookie", token, { httpOnly: true })

                await this.userDAO.cambiarRol(uid, "Premium")

                return res.send({ status: "succes", payload: "El role fue cambiado con exito" })

            }
            let user = {
                id: usuario._id,
                nombre: usuario.first_name,
                apellido: usuario.last_name,
                email: usuario.email,
                edad: usuario.age,
                contraseña: usuario.password,
                rol: "User",
                cart: usuario.cartId
            }
            let token = jwt.sign(user, "coderSecret", { expiresIn: "24h", });

            res.cookie("coderCookie", token, { httpOnly: true })

            await this.userDAO.cambiarRol(uid, "User")

            return res.send({ status: "succes", payload: "El role fue cambiado con exito" })

        }

    }

    async subirDocumentosService(uid, files) {
        const user = await this.userDAO.findUser(uid);
        if (!user) {
            console.log("user no encontrado");
            return "no se encontro el usuario"

        };

        user.documents = Object.values(files).flat().map(file => ({
            name: file.filename,
            reference: file.path
        }))

        await user.save()
    }

    async actualizarUserService(id,res,lastConection){
        const user = await this.userDAO.findUser(id);

        if (!user) {
            return res.send({ status: "error", payload: "No existe el usuario" })

        };

        const update = await this.userDAO.actualizarCampo(id,lastConection)

    }

    async getUsersService(){

        const user = await this.userDAO.getUsers()

        return user
    }

    async eliminarUserPorEmailService(email){
        const users = await this.userDAO.eliminarUserPorEmail(email)
    }

    async eliminarUserPorIdService(uid){
        const users = await this.userDAO.eliminarUserPorId(uid)
    }


    async getInactiveUsersService(){
        let tiempoMaxInactivo = 172800000 // 2 dias
        let tiempoPrueba = 60000 // 1 minuto
        let date = new Date(Date.now() - tiempoMaxInactivo).toLocaleString()
        const inactiveUsers = await this.userDAO.getInactiveUsers(date)
      
        return inactiveUsers

    }

    async deleteInactiveUsersService(){

        const users = await this.getInactiveUsersService()

        if (users.length > 0) {
            users.forEach(user =>{
                let result = transport.sendMail({
                    from: config.emailFrom,
                    to: user.email,
                    subject: "Usuario eliminado",
                    html: `<div>
                    <h1>Su usuario fue eliminado por estar inactivo durante 2 dias.</h1></div > `,
                })
                  this.eliminarUserPorIdService(user.id)
                  return result
            })

            if (users.length == 0) {
                return "los usuarios fueron eliminados"
            }
        }
        else{
            return "No hubo usuarios inactivos durante los ultimos dos dias"
        }
    
    }
}


