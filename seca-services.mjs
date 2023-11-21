import * as ticketMaster from './tm-events-data.mjs' 

export async function getPopularEvents(s, p) {
    return await ticketMaster.getPopularEvents(s, p)
}

export async function searchEvent(name, s, p) {
    return await ticketMaster.searchEvent(name, s, p)
}