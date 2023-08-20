import mongoose from "mongoose";
import { messagesModel } from "./models/messages.models.js"
import config from "../../../config.js";

export default class MessageManager {

    connection = mongoose.connect(config.mongoURL)

    crearChat = async (message) => {
        const messages = await messagesModel.create(message)
        return messages
    };

}