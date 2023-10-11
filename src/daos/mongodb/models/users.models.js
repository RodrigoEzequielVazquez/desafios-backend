import mongoose from 'mongoose'

const collection = 'users'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: { type: String, default: "User" },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    documents: {
        type: [{
            name: {
                type: String,
                required: true
            },
            reference: {
                type: String,
                required: true
            }
        }]
    },
    last_connection: {
        type: String,
        default: null
    },
})

const userModel = mongoose.model(collection, schema)
export default userModel