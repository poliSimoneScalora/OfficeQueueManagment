import { ticketDAO } from "../dao/ticketDAO";
import { Ticket } from "../components/ticket";
import { ServiceDAO } from "../dao/serviceDAO";
import { ServiceType } from "../components/service";
import { TicketListEmpty } from "../errors/ticketErrors";

class ticketController {
    private dao: ticketDAO
    constructor() {
        this.dao = new ticketDAO
    }

    async addTicket(serviceName: string): Promise<Ticket> {
        try {
            let nextwaitlistCode = await this.dao.getNextWaitlistCode();
            let service = await ServiceDAO.prototype.getServiceByName(serviceName);
            await this.dao.addTicket(service.id, nextwaitlistCode);
            await this.dao.addTicketToQueue(service.id, nextwaitlistCode);
            let ticket = await this.dao.getTicketByWaitlistCode(nextwaitlistCode);
            return ticket;
        }
        catch (err) {
            throw err;
        }
    }

    async getAllTickets(): Promise<Ticket[]> {
        try {
            let tickets = await this.dao.getAllTickets();
            return tickets;
        }
        catch(err) {
            throw err;
        }
    }

    async deleteAllTickets(): Promise<void> {
        try {
            let tickets = await this.dao.getAllTickets();
            if(tickets.length === 0) throw new TicketListEmpty();
            await this.dao.deleteAllTickets();
            await this.dao.deleteAllticketsQueue();
            return;
        }
        catch(err) {
            throw err;
        }
    }
}

export { ticketController };