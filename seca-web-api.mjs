import * as secaServices from './seca-services.mjs'
import errorToHttp from './errors-to-http-responses.mjs'
import errors from './errors.mjs'
import {Group} from './seca-classes.mjs'
export const getPopularEvents = processRequest(getPopularEventsProcessor)
export const searchEvent = processRequest(searchEventProcessor)
export const createUser = processRequest(createUserProcessor)
export const createGroup = processRequest(createGroupProcessor, true)
export const updateGroup = processRequest(updateGroupProcessor, true)
export const getAllGroups = processRequest(getAllGroupsProcessor, true)
export const deleteGroup = processRequest(deleteGroupProcessor, true)
export const getGroup = processRequest(getGroupProcessor, true)
export const addToGroup = processRequest(addToGroupProcessor, true)
export const removeFromGroup = processRequest(removeFromGroupProcessor, true)


function processRequest(reqProcessor, auth) {
    return async function(req, rsp) {

        const token = getToken(req)

        if(auth && !token) {
            rsp.status(401).json("Not authorized")
            return
        }

        try {
            if(auth) return await reqProcessor(req, rsp, token)
            return await reqProcessor(req, rsp) 
          
        } catch (e) {
            console.log(e)
            const rspError = errorToHttp(e)
            rsp.status(rspError.status).json(rspError.body)
        }
    }
}


async function getPopularEventsProcessor(req, res) {

    const s = (req.query.s) ? req.query.s : 30
    const p = (req.query.p) ? req.query.p : 1

    if(!isValidIndex(s)) throw errors.INVALID_ARGUMENT('s')
    if(!isValidIndex(p)) throw errors.INVALID_ARGUMENT('p')

    const events = await secaServices.getPopularEvents(s, p)
    return res.status(200).json(events)

}


async function searchEventProcessor(req, res) {

    if(!req.query.name) throw errors.ARGUMENT_MISSING('Name')

    const name = req.query.name
    const s = (req.query.s) ? req.query.s : 30
    const p = (req.query.p) ? req.query.p : 1

    if(!isValidIndex(s)) throw errors.INVALID_ARGUMENT('s')
    if(!isValidIndex(p)) throw errors.INVALID_ARGUMENT('p')

    const events = await secaServices.searchEvent(name, s, p)
    return res.status(200).json(events)

}

function createGroupProcessor(req, res, token) {

    if(!req.body.name || !req.body.description) throw errors.INVALID_BODY(req.body)

    const newGroup = new Group(req.body.name, req.body.description)
    const group = secaServices.createGroup(newGroup, token)

    return res.status(201).json(group)
    
}

function updateGroupProcessor(req, res, token) {

    if(!req.params.id) throw errors.ARGUMENT_MISSING('Id')
    if(!req.body.name || !req.body.description) throw errors.INVALID_BODY(req.body)

    const newGroup = new Group(req.body.name, req.body.description)
    const group = secaServices.updateGroup(req.params.id, newGroup, token)

    return res.status(201).json(group)
}

function getAllGroupsProcessor(req, res, token) {
 
}

function deleteGroupProcessor(req, res, token) {
 
}

function getGroupProcessor(req, res, token) {
 
}

function addToGroupProcessor(req, res, token) {
 
}

function removeFromGroupProcessor(req, res, token) {
 
}

function createUserProcessor(req, res) {

    const username = req.body.username

    if(!username) throw errors.ARGUMENT_MISSING('Username')

    const user = secaServices.createUser(username)

    return res.status(201).json({"user-token": user.token})

}


function isValidIndex(idx) {
    return /[0-9]/.test(idx)
}

function getToken(req) {
    const token = req.get("Authorization")
    if(token) {
        return token.split(" ")[1]
    }
}