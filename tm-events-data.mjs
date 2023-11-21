import crypto from 'crypto'
import errors from './errors.mjs'

const API_KEY = '0sJGeKsAykQ9btsWSGFlQDnVcERMdHl5'


export async function getPopularEvents(s, p) {
    return await getEvents(`https://app.ticketmaster.com/discovery/v2/events/?sort=relevance,desc&size=${s}&page=${p}&apikey=${API_KEY}`)
}

export async function searchEvent(name, s, p) {
    return await getEvents(`https://app.ticketmaster.com/discovery/v2/events/?keyword=${name}&size=${s}&page=${p}&apikey=${API_KEY}`)
}

export async function getEventByID(id) {
    return await getEvent(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`)
}

async function getEvent(url) {
    const response = await fetch(url)
    if (response.ok) {

        let eventDetails = await response.json()
        
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

        return event

    } else {
        throw errors.TICKETMASTER_ERR(response)
    }
}

async function getEvents(url) {
    const response = await fetch(url)
    if (response.ok) {
        return createEvents(await response.json())
    } else {
        throw errors.TICKETMASTER_ERR(response)
    }
}

function createEvents(response) {
   
    let events = []

    if(response._embedded) {

        let eventsDetails = response._embedded.events

        eventsDetails.forEach(eventDetails => {
     
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
            
            events.push(event)

        });
    }

    return events
}
