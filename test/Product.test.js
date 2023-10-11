import supertest from "supertest";
import chai from "chai";
import config from "../config.js";

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Test Products", () => {
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

    //current para confirmar que estamos en una sesion

    it("GET api/sessions/current", async () => {
        const result = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
        console.log(result.body);
        expect(result.body.nombre).to.be.ok
    })

    it("Get /products/ debe traer los productos en un arreglo", async () => {

        const { statusCode, ok, _body } = await requester.get("/products/").set("Cookie", [`${cookie.name}=${cookie.value}`])

        console.log(statusCode, ok, _body);

        expect(Array.isArray(_body.products)).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        expect(ok).to.be.ok
    })

    it("POST /products/ debe crear un producto correctamente", async () => {

        let product = {
            title: "Nachos",
            price: 450,
            stock: 120,
            category: "Snacks",
            description: "Nachos 200gr"
        }
        const { statusCode, ok, _body } = await requester.post("/products/").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(product)

        console.log(statusCode, ok, _body);

        expect(statusCode).to.be.equal(200)
        expect(ok).to.be.ok
        expect(_body.payload).to.have.property("owner")
    })

    it("POST /products/ debe devolver un error al no ingresar todos los campos del producto", async () => {

        //falta la description
        let product = {
            title: "Nachos",
            price: 450,
            stock: 120,
            category: "Snacks",
        }
        const { statusCode, ok, _body } = await requester.post("/products/").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(product)

        console.log(statusCode, ok, _body);

        expect(_body.status).to.be.equal("error")
        expect(_body.error).to.be.equal("Faltan datos")

    })

})