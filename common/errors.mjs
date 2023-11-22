export const ERROR_CODES = {
    INVALID_ARGUMENT: 1,
    INVALID_BODY: 2,
    NOT_FOUND: 3,
    ALREADY_EXISTS: 4,
    NOT_AUTHORIZED: 5,
    TICKETMASTER_ERR: 6,
    ARGUMENT_MISSING: 7,
}

export default {
    INVALID_ARGUMENT: argName => {
        return new Error(ERROR_CODES.INVALID_ARGUMENT, `Invalid argument ${argName}`)
    },
    INVALID_BODY: body => {
        return new Error(ERROR_CODES.INVALID_BODY, `Invalid body`)
    },
    NOT_FOUND: (what) => { 
        return new Error(ERROR_CODES.NOT_FOUND,`${what} not found`)
    },
    ALREADY_EXISTS: (what, where) => {
        return new Error(ERROR_CODES.ALREADY_EXISTS,`${what} already exists ${where}`)
    },
    NOT_AUTHORIZED: (who, what) => { 
        return new Error(ERROR_CODES.NOT_AUTHORIZED,`${who} has no access to ${what}`)
    },
    TICKETMASTER_ERR: (error) => {
        return new Error(ERROR_CODES.TICKETMASTER_ERR, error.statusText, error.status)
    },
    ARGUMENT_MISSING: argName => {
        return new Error(ERROR_CODES.ARGUMENT_MISSING, `${argName} not provided`)
    },
    
}

function Error(code, description, status) {
    this.code = code
    this.description = description
    if(status) this.status = status
}