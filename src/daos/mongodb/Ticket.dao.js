import {ticketModel} from "./models/ticket.model.js"
import mongoose from "mongoose";
import config from "../../../config.js";

export default class TicketDAO { 

    connection = mongoose.connect(config.mongoURL)

    async crearTicket(ticket) {
        const compra = await ticketModel.create(ticket)
        return compra
    }
}