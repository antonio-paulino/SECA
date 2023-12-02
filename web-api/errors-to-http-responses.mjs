import { ERROR_CODES } from '../common/errors.mjs'

function HttpResponse(status, e) {
    this.status = status
    this.body = {
        code: status,
        error: e.description
    }
}

export default function(e) {
    console.log(e)
    switch(e.code) {
        case ERROR_CODES.INVALID_ARGUMENT: return new HttpResponse(400, e)
        case ERROR_CODES.INVALID_BODY: return new HttpResponse(400, e)
        case ERROR_CODES.NOT_FOUND: return new HttpResponse(404, e)
        case ERROR_CODES.ALREADY_EXISTS: return new HttpResponse(400, e)
        case ERROR_CODES.NOT_AUTHORIZED: return new HttpResponse(401, e)
        case ERROR_CODES.TICKETMASTER_ERR: return new HttpResponse(e.status, e)
        case ERROR_CODES.ARGUMENT_MISSING: return new HttpResponse(400, e)
        default: return new HttpResponse(500, "Internal server error.")
    }
}