import errors from '../common/errors.mjs'

const API_KEY = '0sJGeKsAykQ9btsWSGFlQDnVcERMdHl5'

export async function getPopularEvents(s, p) {
    return await getEvents(`https://app.ticketmaster.com/discovery/v2/events/?sort=relevance,desc&size=${s}&page=${p}&apikey=${API_KEY}`)
}

export async function searchEvent(name, s, p) {
    return await getEvents(`https://app.ticketmaster.com/discovery/v2/events/?keyword=${name}&size=${s}&page=${p}&apikey=${API_KEY}`)
}

export async function getEventByID(id, detailed) {
    return await getEvent(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`, detailed)
}

async function getEvent(url, detailed, tries) {

    const response = await fetch(url)

    if (response.ok) {

        let eventDetails = await response.json()
        
        return getEventDetails(eventDetails, detailed)

    } else {
        const attempts = (tries) ? tries : 3
        if(response.status == 429 && attempts > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return await getEvent(url, detailed, attempts - 1)
        }
        else throw errors.TICKETMASTER_ERR(response)
    }

}

async function getEvents(url, tries) {
    const response = await fetch(url)
    if (response.ok) {
        return createEvents(await response.json())
    } else {
        const attempts = (tries) ? tries : 3
        if(response.status == 429 && attempts > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return await getEvents(url, attempts - 1)
        }
        else throw errors.TICKETMASTER_ERR(response)
    }
}

function createEvents(response) {
   
    let events = []

    if(response._embedded) {

        let eventsDetails = response._embedded.events
        eventsDetails.forEach(eventDetails => {events.push(getEventDetails(eventDetails))});

    }

    return events
}


function getEventDetails(eventDetails, detailed) {

    let event = {
        id: eventDetails.id,
        name: eventDetails.name,
        date: eventDetails.dates.start.dateTime
    }   

    if (eventDetails.classifications) {
        if(eventDetails.classifications[0].genre)
            event.genre = eventDetails.classifications[0].genre.name
        if(eventDetails.classifications[0].segment)
            event.segment = eventDetails.classifications[0].segment.name
    }

    if(detailed) {
        event.timezone = eventDetails.dates.timezone

        if(eventDetails.classifications[0].subGenre)
            event.subGenre = eventDetails.classifications[0].subGenre.name

        if(eventDetails.images) 
            event.image = eventDetails.images[0].url

        if(eventDetails.sales) {
            event.salesStartTime = eventDetails.sales.public.startDateTime
            event.salesEndTime = eventDetails.sales.public.endDateTime
        }

    }

    return event

}