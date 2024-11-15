import { ServiceDAO } from "../dao/serviceDAO";
import { ServiceType } from "../components/service";
import { ServiceListEmptyError } from "../errors/serviceErrors";

/**
 * Represents a controller for managing services.
*/

class serviceController {
    private dao: ServiceDAO
    constructor() {
        this.dao = new ServiceDAO 
    }

    async getAllServices(): Promise<ServiceType[]> {
        try {
            let serviceArray = await this.dao.getAllServices();
            return serviceArray;
        }
        catch (err) {
            throw err;
        }
    }

    async getServiceByName(serviceName: string): Promise<ServiceType> {
        try {
            let service = await this.dao.getServiceByName(serviceName);
            return service;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteAllServices(): Promise<void> {
        try {
            let services = await this.dao.getAllServices();
            if(services.length === 0) throw new ServiceListEmptyError();
            await this.dao.deleteAllServices();
            return;
        }
        catch (err) {
            throw err;
        }
    }
}

export {serviceController};