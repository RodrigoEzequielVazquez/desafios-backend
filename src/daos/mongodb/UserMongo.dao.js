import userModel from "./models/users.models.js";

export default class UserDAO {

    async findUser(id) {
        let result = await userModel.findById({ _id: id })
        return result
    }

    async updatePassword(email, newPassword) {
        let user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("User wasn't found")
        }

        await userModel.updateOne({ _id: user._id }, { $set: { password: newPassword } });
    }

    async actualizarCampo(id, coneccion) {
        await userModel.updateOne({ _id: id }, { $set: { last_connection: coneccion } });
    }

    async cambiarRol(uid,role){
        return userModel.updateOne({_id: uid}, {role})
    }

    async getUsers (){
        return userModel.find({})
    }

    async getInactiveUsers(tiempoIncativo){
        return userModel.find({last_connection:{$lt: tiempoIncativo}})
    }

    async eliminarUserPorId(id){
        let result = await userModel.deleteOne({ _id: id })
        return result
    }

    async eliminarUserPorEmail(email){
        let result = await userModel.deleteOne({ email: email })
        return result
    }

}