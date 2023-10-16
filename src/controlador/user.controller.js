import UserService from "../services/user.service.js"

export default class UserController {

    constructor() {
        this.userService = new UserService()
    }

    async cambiarRolController(uid, role, req, res) {

        if (uid && role && role == "User" || "Premium") {

            console.log(role);
            console.log("paso controller");
            
           // const email = req.user.id

            await this.userService.cambiarRolService(uid,role,res)

        }
        else{
            return res.send({ status: "error", payload: "No ingreso un role correcto" })
        }
        
    }

    async subirDocumentosController(uid, files) {
        if(!files){
            return res.send({ status: "error", payload: "Error al subir archivos" })
           }
        await this.userService.subirDocumentosService(uid, files)
       }

    async actualizarUserController(id,res){
    

        let coneccion = new Date().toLocaleString()


        await this.userService.actualizarUserService(id,res,coneccion)
        

    }   

}
