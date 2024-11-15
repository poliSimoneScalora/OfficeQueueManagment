const SERVICE_NOT_FOUND = "Service not found"
const SERVICE_LIST_EMPTY_ERROR = "Service list is empty"

class ServiceNotFoundError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super();
        this.customMessage = SERVICE_NOT_FOUND;
        this.customCode = 404;
    }
}

class ServiceListEmptyError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super();
        this.customMessage = SERVICE_LIST_EMPTY_ERROR;
        this.customCode = 404;
    }
}

export {ServiceNotFoundError, ServiceListEmptyError};