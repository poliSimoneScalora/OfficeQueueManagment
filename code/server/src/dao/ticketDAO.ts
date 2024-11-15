import { Ticket, ServedStatus } from "../components/ticket";
import db from "../db/db"
import { TicketNotFoundError } from "../errors/ticketErrors";
/**
 * Represents a DAO for interaction mainly with ticket table in the database.
 */

class ticketDAO {
    /**
     * Adds a ticket in the ticket table.
     * @param serviceID represents the id of the service asked.
     * @param waitlistCode represents the code of priority of the ticket in the date of today.
     * @returns A void promise to check db errors.
     */

    addTicket(serviceID: number, waitlistCode: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ticket(ticketID, serviceID, waitlistCode, counterID, servedTime, ticketDate) 
            VALUES(null, ?, ?, null, null, DATETIME('now'))`
            db.run(sql, [serviceID, waitlistCode], (err: Error) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
                else resolve(); 
            })
        })
    }
    /**
     * Computes the next code for the queue insertion.
     * @returns A promise that resolves to lastWaitlistCode + 1 when the queue is not empty, 1 otherwise.
     */
    getNextWaitlistCode(): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT MAX(waitlistCode) AS maxCode FROM ticket WHERE strftime('%Y-%m-%d', ticketDate) = DATE('now')`
            db.get(sql, [], (err: Error, row: {maxCode: number}) => {
                if(err) reject(err)
                row.maxCode ? resolve(row.maxCode + 1) : resolve(1)
            })
        })
    }
    /**
     * Adds a ticket to the today queue.
     * @param serviceID represents the id of the service asked.
     * @param waitlistCode represents the code of priority of the ticket in the date of today.
     * @returns A promise that resolves to a Ticket object if it's found, throws the TicketNotFoundError otherwise.
     */
    addTicketToQueue(serviceID: number, waitlistCode: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO queue(waitlistCode, serviceID) VALUES(?, ?)`
            db.run(sql, [waitlistCode, serviceID], (err: Error) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
    /**
     * Gets a ticket given its unique id.
     * @param ticketID represents the id of the ticket.
     * @returns A promise that resolves to a Ticket object if it's found, throws the TicketNotFoundError otherwise.
     */
    getTicketByID(ticketID: number): Promise<Ticket> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ticket WHERE ticketID = ?`
            db.get(sql, [ticketID], (err: Error, row: {ticketID: number, serviceID: number, waitlistCode: number, counterID: number | null, servedTime: string | null, ticketDate: string, served: ServedStatus}) => {
                if(err) reject(err);
                row ? 
                resolve(new Ticket(row.ticketID, row.serviceID, row.waitlistCode, row.counterID, row.servedTime, row.ticketDate, row.served)) 
                : reject(new TicketNotFoundError());
            })
        })
    }
    /**
     * Gets a ticket given its waitlist code.
     * @param waitlistCode represents the priority code of the ticket today.
     * @returns A promise that resolves to a Ticket object if it's found, throws the TicketNotFoundError otherwise.
     */
    getTicketByWaitlistCode(waitlistCode: number): Promise<Ticket> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ticket WHERE waitlistCode = ? AND strftime('%Y-%m-%d', ticketDate) = DATE('now')` 
            db.get(sql, [waitlistCode], (err: Error, row: {ticketID: number, serviceID: number, waitlistCode: number, counterID: number | null, servedTime: string | null, ticketDate: string, served: ServedStatus}) => {
                if(err) reject(err);
                row ? 
                resolve(new Ticket(row.ticketID, row.serviceID, row.waitlistCode, row.counterID, row.servedTime, row.ticketDate, row.served)) 
                : reject(new TicketNotFoundError());
            })
        })
    }
    /**
     * Sets the ticket counter when the customer is called.
     * @param ticketID represents the id of the ticket.
     * @param counterID represents the unique id of the counter.
     * @returns A void promise to check db errors.
     */
    setTicketCounter(ticketID: number, counterID: number): Promise<void>{
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket 
            SET counterID = ? WHERE ticketID = ?`
            db.run(sql, [counterID, ticketID], (err: Error) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
    
    getAllTickets(): Promise<Ticket[]> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ticket`
            db.all(sql, [], (err: Error, rows: any) => {
                const tickets: Ticket[] = [];
                if(rows) {
                    rows.forEach((row: {ticketID: number, serviceID: number, waitlistCode: number, counterID: number | null, servedTime: string | null, ticketDate: string, served: ServedStatus}) => {
                        tickets.push(new Ticket(row.ticketID, row.serviceID, row.waitlistCode, row.counterID, row.servedTime, row.ticketDate, row.served));
                    })
                }
                resolve(tickets);
            })
        })
    }

    deleteAllTickets(): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ticket`
            db.run(sql, [], (err: Error) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    deleteAllticketsQueue(): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM queue`
            db.run(sql, [], (err: Error) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
}

export {ticketDAO};