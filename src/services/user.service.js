import UserDAO from "../daos/mongodb/UserMongo.dao.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({ service: "gmail", port: 587, auth: { user: "colo.202019@gmail.com", pass: "jgbohsuyqpxdpgpi" } })

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
         console.log(usuario);


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


                console.log(documents);
                //  console.log(usuario.documents[0].name.split(".")[0]);
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

        console.log("usuario service");
        console.log(user.documents);
        let documentos
        user.documents = Object.values(files).flat().map(file => ({
            name: file.filename,
            reference: file.path
        }))

        await user.save()
    }

    async actualizarUserService(id,res,lastConection){
        const user = await this.userDAO.findUser(id);

        if (!user) {
            console.log("user no encontrado");
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
        let tiempoMaxInactivo = 172800000
        let tiempoPrueba = 60000 // 1 minutos
        let date = new Date(Date.now() - tiempoPrueba).toLocaleString()
        console.log(date);
        const inactiveUsers = await this.userDAO.getInactiveUsers(date)
       // console.log( Date.now());
      
        return inactiveUsers

    }

    async deleteInactiveUsersService(){

        const users = await this.getInactiveUsersService()

        console.log(users);
        console.log("0");
        if (users.length > 0) {
            console.log("0");
            users.forEach(user =>{
                let result = transport.sendMail({
                    from: "colo.202019@gmail.com",
                    to: user.email,
                    subject: "Usuario eliminado",
                    html: `<div>
                    <h1>Su usuario fue eliminado por estar inactivo durante 2 dias.</h1></div > `,
                })
                 // this.eliminarUserPorIdService(user.id)
                  return result
            })

            if (users.length == 0) {
                return console.log("los usuarios fueron eliminados");
            }
        }
        else{
            return "No hubo usuarios inactivos durante los ultimos dos dias"
        }
    
    }
}


