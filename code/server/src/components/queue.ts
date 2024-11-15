/**
 * Represents a queue in the database
 */

class Queue {
     serviceID: number
     waitList: number[]

    /**
     * Creates a new instance of the Queue class.
     * @param serviceID ID of the service offered 
     * @param waitList array of ticket numbers(waitlistCode is unique only in the day)
     */
    
    constructor(serviceID: number, waitList: number[]) {
        this.serviceID = serviceID;
        this.waitList = waitList;
    }
}