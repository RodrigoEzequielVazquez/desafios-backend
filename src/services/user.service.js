import UserDAO from "../daos/mongodb/UserMongo.dao.js"
import jwt from "jsonwebtoken"

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

    async cambiarRolService(uid, role, res) {

        const usuario = await this.findUserService(uid)
         console.log(usuario);

        if (usuario) {

            if (role === "Premium") {
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
                    rol: role,
                    cart: usuario.cartId
                }
                let token = jwt.sign(user, "coderSecret", { expiresIn: "24h", });

                res.cookie("coderCookie", token, { httpOnly: true })

                await this.userDAO.cambiarRol(uid, role)

                return res.send({ status: "succes", payload: "El role fue cambiado con exito" })

            }
            let user = {
                id: usuario._id,
                nombre: usuario.first_name,
                apellido: usuario.last_name,
                email: usuario.email,
                edad: usuario.age,
                contraseña: usuario.password,
                rol: role,
                cart: usuario.cartId
            }
            let token = jwt.sign(user, "coderSecret", { expiresIn: "24h", });

            res.cookie("coderCookie", token, { httpOnly: true })

            await this.userDAO.cambiarRol(uid, role)

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
}


