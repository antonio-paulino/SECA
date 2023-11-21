export const ERROR_CODES = {
    INVALID_ARGUMENT: 1,
    INVALID_BODY: 2,
    NOT_FOUND: 3,
    USER_NOT_FOUND: 4,
    USER_ALREADY_EXISTS: 5,
    NOT_AUTHORIZED: 6,
    TICKETMASTER_ERR: 7,
    ARGUMENT_MISSING: 8
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
    USER_NOT_FOUND: (who) => { 
        return new Error(ERROR_CODES.USER_NOT_FOUND,`User with token ${who} not found`)
    },
    USER_ALREADY_EXISTS: (who) => {
        return new Error(ERROR_CODES.USER_ALREADY_EXISTS,`Username ${who} is taken`)
    },
    NOT_AUTHORIZED: (who, what) => { 
        return new Error(ERROR_CODES.NOT_AUTHORIZED,`${who} has no access to ${what}`)
    },
    TICKETMASTER_ERR: (error) => {
        return new Error(ERROR_CODES.TICKETMASTER_ERR, error.statusText, error.status)
    },
    ARGUMENT_MISSING: argName => {
        return new Error(ERROR_CODES.ARGUMENT_MISSING, `${argName} not provided`)
    }


    
}

function Error(code, description, status) {
    this.code = code
    this.description = description
    if(status) this.status = status
}