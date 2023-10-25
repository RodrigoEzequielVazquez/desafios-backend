import UserService from "../services/user.service.js"
import { UsersDTO } from "./DTO/users.dto.js";

export default class UserController {

    constructor() {
        this.userService = new UserService()
    }

    async cambiarRolController(uid, req, res) {

        if (uid) {

            await this.userService.cambiarRolService(uid, res)

        }
        else {
            return res.send({ status: "error", payload: "No ingreso un role correcto" })
        }

    }

    async subirDocumentosController(uid, files) {
        if (!files) {
            return res.send({ status: "error", payload: "Error al subir archivos" })
        }
        await this.userService.subirDocumentosService(uid, files)
    }

    async actualizarUserController(id, res) {

        let coneccion = new Date().toLocaleString()

        await this.userService.actualizarUserService(id, res, coneccion)

    }

    async getUsersController(view) {

        let users = await this.userService.getUsersService()

        let principalInfo = users.map((user) =>{
            return new UsersDTO(user,view)
        })

        return principalInfo

    }

    async eliminarUserPorEmailController(email){
        let users = await this.userService.eliminarUserPorEmailService(email)
    }

    
    async getInactiveUsersController(res) {

        let users = await this.userService.deleteInactiveUsersService()

        return res.status(200).send({ status: "success", payload: users })

    }



}
