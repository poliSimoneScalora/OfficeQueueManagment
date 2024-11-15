const TICKET_NOT_FOUND = "Ticket not found"
const TICKET_LIST_EMPTY = "Ticket list is empty"

class TicketNotFoundError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super();
        this.customMessage = TICKET_NOT_FOUND;
        this.customCode = 404;
    }
}

class TicketListEmpty extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super();
        this.customMessage = TICKET_LIST_EMPTY;
        this.customCode = 404;
    }
}


export {TicketNotFoundError, TicketListEmpty};