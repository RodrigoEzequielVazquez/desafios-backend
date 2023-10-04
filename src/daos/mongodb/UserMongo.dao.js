import userModel from "./models/users.models.js";

export default class UserDAO {

    async findUser(email) {
        let result = await userModel.findOne({ email: email })

        return result
    }

    async updatePassword(email, newPassword) {
        let user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("User wasn't found")
        }

        await userModel.updateOne({ _id: user._id }, { $set: { password: newPassword } });
    }

    async cambiarRol(uid,role){
        return userModel.updateOne({_id: uid}, {role})
    }

}