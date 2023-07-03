import mongoose from "mongoose";
import { messagesModel } from "./models/messages.models.js"

export default class MessageManager {

    connection = mongoose.connect("mongodb+srv://rodrigovazquez99:BcKutvT3FsEJwAOL@cluster0.y15gbah.mongodb.net/?retryWrites=true&w=majority")

    crearChat = async (message) => {
        const messages = await messagesModel.create(message)
        return messages
    };

}