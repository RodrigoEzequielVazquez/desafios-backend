import TicketDAO from "../daos/mongodb/Ticket.dao.js";
import { v4 as uuidV4 } from "uuid";

export default class TicketService {

    constructor() {
        this.ticketDAO = new TicketDAO()
    }

    async crearTicketService(productos, comprador) {

        console.log(productos);
        console.log(comprador);

        let total = productos.reduce((acumulador, prod) => { return acumulador + prod.precio * prod.cantidad }, 0)
        console.log(total);
        let ticket = {
            code: uuidV4(),
            products: productos,
            amount: total,
            purchaser: comprador
        }

        await this.ticketDAO.crearTicket(ticket)
    }


    async getTicketService() {

       return await this.ticketDAO.getTicket()
    }
  


}