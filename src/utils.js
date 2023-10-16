import { fileURLToPath } from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import { faker } from "@faker-js/faker"
import multer from "multer"
import mime from 'mime-types';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const generarProductos = () => {
  return {
    ObjectId: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(10),
    category: faker.commerce.department(),
    price: faker.commerce.price(),
    stock: faker.number.int({ max: 400 })
  }
}

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    console.log(file.fieldname);
    let field = file.fieldname
    if (field == "profiles") {
      cb(null, __dirname + "/public/images/profiles")
    }
    if (field == "products") {
      cb(null, __dirname + "/public/images/products")
    }
    if (field == "identificacion" || field == "cuenta" || field == "domicilio" ) {
      cb(null, __dirname + "/public/images/documents")
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}.${mime.extension(file.mimetype)}`)
  }
})

export const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next();
  },
  
});
export default __dirname