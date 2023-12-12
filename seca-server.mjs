import express from 'express'
import * as secaData from './data/seca-data-elastic.mjs'
import * as ticketMaster from './data/tm-events-data.mjs'
import url from 'url'
import path from 'path'
import hbs from 'hbs'
import secaServicesInit from './services/seca-services.mjs'
import secaApiInit from './web/api/seca-web-api.mjs'
import secaSiteInit from './web/site/seca-web-site.mjs'

const secaServices = secaServicesInit(secaData, ticketMaster)
const secaApi = secaApiInit(secaServices)
const secaSite = secaSiteInit(secaServices)

const PORT = 1904
const SERVER_URL = `http://localhost:${PORT}`

console.log("Starting server...")

let app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use('/site', express.static('./web/site/public'))

const currentFileDir = url.fileURLToPath(new URL('.', import.meta.url));
const viewsDir = path.join(currentFileDir, 'web', 'site', 'views')
app.set('view engine', 'hbs')
app.set('views', viewsDir);

hbs.registerPartials(path.join(viewsDir, 'partials'))
hbs.registerHelper('calculatePagination', function calculatePagination(type, size, page) {
   
    let pageNum = parseInt(page)
    if(type == 'previous' && pageNum - 1 < 0) return false
    else if(type == 'next' && (size * (pageNum + 1)) >= 1000) return false
    else return true

});

// SITE ROUTES

// Search Menu
app.get('/site/search', secaSite.getSearch)

// Search popular events
app.get('/site/search/popular', secaSite.getPopularEvents)

// Search events by name
app.get('/site/search/name', secaSite.searchEvent)

// Get Event Details
app.get('/site/event', secaSite.getMoreDetails)

// Home Page
app.get('/site/home', secaSite.getHome)

// Get user groups
app.get('/site/groups', secaSite.getAllGroups)

// Update group
app.post('/site/groups/:id/edit', secaSite.updateGroup)

// Remove Group
app.post('/site/groups/:id/remove', secaSite.deleteGroup)

// Add Group
app.post('/site/groups/add', secaSite.createGroup)

// Get Group
app.get('/site/groups/:id', secaSite.getGroup)

// Search Popular Events 
app.get('/site/groups/:id/events/search/popular', secaSite.groupSearchEventsPopular)

// Search events by name
app.get('/site/groups/:id/events/search/name', secaSite.groupSearchEvents)

// Add event to group
app.post('/site/groups/:id/events/add', secaSite.addToGroup)

// Remove event from group
app.post('/site/groups/:id/events/delete', secaSite.removeFromGroup)

// Get site css
app.get('/site/css', secaSite.getCss)

// Get site page scripts
app.get('/site/scripts', secaSite.getScripts)


// API ROUTES

// Get Popular events: GET /events/popular
app.get('/events/popular', secaApi.getPopularEvents)

// Get events by name: GET /events
app.get('/events', secaApi.searchEvent)

// Get more details from an event: GET /events/:eventID
app.get('/events/:id', secaApi.getMoreDetails)

// Create group: POST /groups
app.post('/groups', secaApi.createGroup)

// Update Group name and description: PUT /groups/:id
app.put('/group/:id', secaApi.updateGroup)

// List all groups : GET /groups
app.get('/groups', secaApi.getAllGroups)

// Delete Group: DELETE /groups/:id
app.delete('/group/:id', secaApi.deleteGroup)

// Get specific group : GET /groups/:id
app.get('/group/:id', secaApi.getGroup)

// Add event to group : PUT /groups/:id/events
app.put('/group/:id/events', secaApi.addToGroup)

// Remove event from group : DELETE /groups/:id/events/:id
app.delete('/group/:groupID/events/:eventID', secaApi.removeFromGroup)

// Add new user : POST /users
app.post('/users', secaApi.createUser)

app.listen(PORT, () => console.log(`Server listening in ${SERVER_URL}`))

