import mongoose from "mongoose";

const collection = 'messages'

const messagesSchema = new mongoose.Schema({
    
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const messagesModel = mongoose.model(collection, messagesSchema)