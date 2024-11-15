import { rejects } from "assert"
import { ServiceType } from "../components/service"
import db from "../db/db"
import { ServiceNotFoundError } from "../errors/serviceErrors"
/**
 * Represents a DAO for interaction mainly with server table in the database.
 */

class ServiceDAO {
    /**
     * Gets a service object from the service table given the service id.
     * @param serviceID represents the id of the service.
     * @returns A promise that resolves to a Service object if it's found, throws the ServiceNotFoundError otherwise.
     */   
    getServiceByID(serviceID: number): Promise<ServiceType> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM service WHERE serviceID = ?`
            db.get(sql, [serviceID], (err: Error, row: {serviceID: number, serviceTag: string, serviceName: string, description: string | null, serviceTime: number}) => {
                if(err) reject(err);
                row ?
                resolve(new ServiceType(row.serviceID, row.serviceTag, row.serviceName, row.description, row.serviceTime))
                : reject(new ServiceNotFoundError())
            })
        })
    }
    /**
     * Gets a service object from the service table given the service name.
     * @param serviceName represents the name of the service.
     * @returns A promise that resolves to a Service object if it's found, throws the ServiceNotFoundError otherwise.
     */   
    getServiceByName(serviceName: string): Promise<ServiceType> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM service WHERE serviceName = ?`
            db.get(sql, [serviceName], (err: Error, row: {serviceID: number, serviceTag: string, serviceName: string, description: string | null, serviceTime: number}) => {
                if(err) reject(err);
                row ?
                resolve(new ServiceType(row.serviceID, row.serviceTag, row.serviceName, row.description, row.serviceTime))
                : reject(new ServiceNotFoundError())
            })
        })
    }
    /**
     * Gets a service object from the service table given the service id.
     * @returns A promise that resolves to a Service list if it's found, throws the ServiceListEmptyError otherwise.
     */   
    getAllServices(): Promise<ServiceType[]> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM service`
            db.all(sql, [], (err: Error, rows: any) => {
                if(err) reject(err);
                else {
                    let services: ServiceType[] = [];
                    if(rows) {
                        rows.forEach((row: {serviceID: number, serviceTag: string, serviceName: string, description: string | null, serviceTime: number}) => {
                            services.push(new ServiceType(row.serviceID, row.serviceTag, row.serviceName, row.description, row.serviceTime));
                        })
                    }
                    resolve(services);
                }
            })
        })
    }

    deleteAllServices(): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM service`
            db.run(sql, [], (err: Error) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
}

export {ServiceDAO};