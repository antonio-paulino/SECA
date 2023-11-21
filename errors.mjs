export const ERROR_CODES = {
    INVALID_ARGUMENT: 1,
    INVALID_BODY: 2,
    NOT_FOUND: 3,
    USER_ALREADY_EXISTS: 4,
    NOT_AUTHORIZED: 5,
    TICKETMASTER_ERR: 6,
    ARGUMENT_MISSING: 7,
    EVENT_ALREADY_IN_GROUP: 8
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
    },
    EVENT_ALREADY_IN_GROUP: event => {
        return new Error(ERROR_CODES.EVENT_ALREADY_IN_GROUP, `Event with id ${event.id} already in group`)
    }



    
}

function Error(code, description, status) {
    this.code = code
    this.description = description
    if(status) this.status = status
}