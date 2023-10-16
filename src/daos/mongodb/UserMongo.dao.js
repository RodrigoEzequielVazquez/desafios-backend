import userModel from "./models/users.models.js";

export default class UserDAO {

    async findUser(id) {
        let result = await userModel.findById({ _id: id })

       // console.log(result);
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

        console.log("dao");
        console.log(coneccion);
        await userModel.updateOne({ _id: id }, { $set: { last_connection: coneccion } });
    }

    async cambiarRol(uid,role){
        return userModel.updateOne({_id: uid}, {role})
    }

}