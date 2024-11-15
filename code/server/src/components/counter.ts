import { ServiceType } from "./service";

/**
 * Represents a counter
 */
class Counter {
    id: number
    services: ServiceType[]
    status: boolean
    /**
     * Creates a new instance of the Service class.
     * @param id ID for unique record 
     * @param services list of services that a counter handle
     * @param status represents if the counter is active
     */
    constructor(id: number, services: ServiceType[], status: boolean) {
        this.id = id;
        this.services= services;
        this.status = status
    }
}

export { Counter }