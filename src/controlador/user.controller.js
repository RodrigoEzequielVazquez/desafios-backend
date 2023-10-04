import UserService from "../services/user.service.js"

export default class UserController {

    constructor() {
        this.userService = new UserService()
    }

    async cambiarRolController(uid, role, req, res) {

        if (uid && role && role == "User" || "Premium") {

            console.log(role);
            console.log("paso controller");
            
            const email = req.user.email

            await this.userService.cambiarRolService(uid,role,email,res)

            return res.send({ status: "succes", payload: "El role fue cambiado con exito" })
        }
        return res.send({ status: "error", payload: "No ingreso un role correcto" })
    }

}
