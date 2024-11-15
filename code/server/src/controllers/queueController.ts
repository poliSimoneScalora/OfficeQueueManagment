import { QueueDAO } from "../dao/queueDAO";
import { Counter } from "../components/counter";
import { ServiceType } from "../components/service";
import { Ticket } from "../components/ticket";
import {CounterDAO} from "../dao/counterDAO";


class QueueController{
    private dao: QueueDAO;
    private daoCounter: CounterDAO;

    constructor() {
        this.dao = new QueueDAO();
        this.daoCounter = new CounterDAO();
    }

    /**
     * Adds a new review for a product
     * @returns A Promise that resolves to an array of users
     */
    async getAllTicketsInQueues(): Promise<Ticket[]> {
        return this.dao.getAllTicketsInQueues();
     } 

     async getNextCustomerByQueue(id: number, queue: number[]) : Promise<number> { 
        return new Promise<number>(async (resolve, reject) => {
            const next: number = Math.min(...queue);
            await this.dao.deleteWaitlistCode(next);
            await this.dao.updateTicketCounter(next, id);
            resolve(next);
        })
    }

    /**
     * Retrieves the next customer for a specific counter.
     * @param id - The counterID of the counter that is waiting for the customer.
     * @returns A Promise that resolves to the next customer.
     */
    async getNextCustomer(id: number) : Promise<number> { 
        return new Promise<number>(async (resolve, reject) => {
            let next: number = 0;
            let maxTime: number = 0.0;
            let selectedQueue: number[] = [];
            const services : ServiceType[] = await this.daoCounter.getServicesByCounter(id);
            const last: number = services[services.length-1].id;
            for (let service of services) {
                const queue: number[] = await this.dao.getQueueByService(service.id);
                if (queue.length>0){
                    const counters: Counter[] = await this.daoCounter.getActiveCountersByService(service.id);
                    let den: number = 0.0;
                    counters.forEach((counter: Counter) =>{
                        den += 1/counter.services.length;
                    })
                    const time: number = ((queue.length/den)+0.5)*service.serviceTime;
                    if (time>maxTime){
                        maxTime=time;
                        selectedQueue=queue;
                        if (service.id==last){
                            next = await this.getNextCustomerByQueue(id, selectedQueue);
                            resolve(next);
                        }
                    }
                    else{
                        if (service.id==last){
                            next = await this.getNextCustomerByQueue(id, selectedQueue);
                            resolve(next);
                        }
                    }
                }
                else{
                    if (service.id==last){
                        next = await this.getNextCustomerByQueue(id, selectedQueue);
                        resolve(next);
                    }
                }
            }
        })
    }

    /**
     * Save current customer as served and retrieves the next customer for a specific counter.
     * @param id - The counterID of the counter that has finished and is waiting for another customer.
     * @returns A Promise that resolves to the next customer.
     */
    async setServed(id: number) : Promise<number> { 
        return new Promise<number>(async (resolve, reject) => {
            await this.dao.setTicketServed(id);
            const next: number = await this.getNextCustomer(id);
            resolve(next);
        })
    }

    /**
     * Save current customer as not served and retrieves the next customer for a specific counter.
     * @param id - The counterID of the counter that is waiting for another customer.
     * @returns A Promise that resolves to the next customer.
     */
    async setNotServed(id: number) : Promise<number> { 
        return new Promise<number>(async (resolve, reject) => {
            await this.dao.setTicketNotServed(id);
            const next: number = await this.getNextCustomer(id);
            resolve(next);
        })
    }

}

export {QueueController}