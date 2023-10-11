import supertest from "supertest";
import chai from "chai";
import config from "../config.js";
import mongoose from "mongoose";
import UserDAO from "../src/daos/mongodb/UserMongo.dao.js";
import { createHash, isValidPassword } from "../src/utils.js";

const connection = mongoose.connect(config.mongoURL)

const expect = chai.expect
const requester = supertest("http://localhost:8080")

console.log(connection);

describe("Test Sessions", () => {

    let userDAO
    // before(async function () {

    //     mongoose.connection.collections.users.drop()
    //     userDAO = new UserDAO()
    // })

    let cookie
    it("POST /api/sessions/register debe crear un producto correctamente", async () => {

        const mockUser = {
            first_name: "Lionel",
            last_name: "Messi",
            email: "soyMessi@gmail.com",
            password: "123",
            age: 36
        };

        const { statusCode, ok, _body } = await requester.post("/api/sessions/register").send(mockUser)
        console.log(statusCode, ok, _body);

        expect(statusCode).to.be.equal(200)
        expect(ok).to.be.ok
        expect(_body.status).to.be.equal("success")

    })

    it("Probar hash", async () => {
        const hashedPassword = await createHash("12345")
        expect(hashedPassword).to.not.be.equal("12345")
    })

    it("Probar comparacion de hash sea valida", async () => {
        const hashedPassword = await createHash("123456")
        const result = await isValidPassword("123456", { password: hashedPassword })
        expect(result).to.be.equal(true)
    })

      it("Probar comparacion si el hash se altera", async() =>{
        const hashedPassword = await createHash("1234567")
        const result = await isValidPassword("1234567", { password: hashedPassword + "123"})
        expect(result).to.be.equal(false)
      })
})