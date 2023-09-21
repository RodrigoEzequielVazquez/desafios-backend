import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import { faker } from "@faker-js/faker"

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (password,user) => bcrypt.compareSync(password,user.password)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const generarProductos = () =>{
    return {
        ObjectId: faker.database.mongodbObjectId(),
        title : faker.commerce.productName(),
        description : faker.commerce.productDescription(),
        code : faker.string.alphanumeric(10),
        category : faker.commerce.department() ,
        price: faker.commerce.price(),
        stock: faker.number.int({max:400})
    }
}