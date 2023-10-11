import supertest from "supertest";
import chai from "chai";
import config from "../config.js";

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Test Carts", () => {
    let cookie;
    before(async function () {

        // mongoose.connection.collections.users.drop()
        // userDAO = new UserDAO()


        // Login de un usuario para pasar por autenticacion
        const mockUser = {
            email: config.adminEmail,
            password: config.adminPassword
        }
        const result = await requester.post("/api/sessions/login").send(mockUser)
        // console.log(result.headers);
        const cookieResult = result.headers["set-cookie"][0]
        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }
    })

    it("GET /carts/", async () => {
        const { statusCode, ok, _body } = await requester.get("/carts").set("Cookie", [`${cookie.name}=${cookie.value}`])
        console.log(statusCode, ok, _body);
        
        expect(Array.isArray(_body)).to.be.equal(true)
       
    })

    
    it("GET /carts/:cid debe traer un carrito por su id", async () => {

        const cartId = "64e14c586f3343096e40ab92"
        const { statusCode, ok, _body } = await requester.get("/carts/" + cartId)

        console.log(statusCode, ok, _body);

        expect(statusCode).to.be.equal(200)
        expect(ok).to.be.ok
        expect(_body.status).to.be.equal("success")
    })

    it("DELETE /carts/:cid debe eliminar todos los productos del carrito", async () => {

        const cartId = "64e14c586f3343096e40ab92"
        const { statusCode, ok, _body } = await requester.delete("/carts/" + cartId)

        console.log(statusCode, ok, _body);

        expect(statusCode).to.be.equal(200)
        expect(ok).to.be.ok
        expect(_body.status).to.be.equal("Se eliminaron todos los productos")
    })

})