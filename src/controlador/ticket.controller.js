import TicketService from "../services/ticket.service.js"

export default class TicketController {

    constructor() {
        this.ticketService = new TicketService()
    }

    async getTicketController() {
  
        return await this.ticketService.getTicketService()

    }
}