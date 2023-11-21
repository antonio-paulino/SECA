import express from 'express'

import * as secaApi from './seca-web-api.mjs'

const PORT = 1904

console.log("Starting server...")
let app = express()


app.use(express.json())

// Get Popular events: GET /events/popular
app.get('/events/popular', secaApi.getPopularEvents)

// Get events by name: GET /events
app.get('/events', secaApi.searchEvent)

// Create group: POST /groups
app.post('/groups', secaApi.createGroup)

// Update Group name and description: PUT /groups/:id
app.put('/groups/:id', secaApi.updateGroup)

// List all groups : GET /groups
app.get('/groups', secaApi.getAllGroups)

// Delete Group: DELETE /groups/:id
app.delete('/groups/:id', secaApi.deleteGroup)

// Get specific group : GET /groups/:id
app.post('/users', secaApi.getGroup)

// Add event to group : POST /groups/:id/events
app.put('/groups/:id/events', secaApi.addToGroup)

// Remove event from group : DELETE /groups/:id/events/:id
app.delete('/groups/:id/events', secaApi.removeFromGroup)

// Add new user : POST /users
app.post('/users', secaApi.createUser)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("End setting up server")