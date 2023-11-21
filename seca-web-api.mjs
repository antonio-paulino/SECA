import * as secaServices from './seca-services.mjs'
import errorToHttp from './errors-to-http-responses.mjs'
import errors from './errors.mjs'

export const getPopularEvents = processRequest(getPopularEventsProcessor)
export const searchEvent = processRequest(searchEventProcessor)
export const createGroup = processRequest(createGroupProcessor)
export const updateGroup = processRequest(updateGroupProcessor)
export const getAllGroups = processRequest(getAllGroupsProcessor)
export const deleteGroup = processRequest(deleteGroupProcessor)
export const getGroup = processRequest(getGroupProcessor)
export const addToGroup = processRequest(addToGroupProcessor)
export const removeFromGroup = processRequest(removeFromGroupProcessor)
export const createUser = processRequest(createUserProcessor)


function processRequest(reqProcessor) {
    return async function(req, rsp) {

       //const token = getToken(req)

       //if(!token) rsp.status(401).json("Not authorized")  

            try {
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
    const events = await secaServices.getPopularEvents(s, p)
    return res.json(events)
}


async function searchEventProcessor(req, res) {
    if(!req.query.name) throw errors.ARGUMENT_NOT_PROVIDED('Name')
    const name = req.query.name
    const s = (req.query.s) ? req.query.s : 30
    const p = (req.query.p) ? req.query.p : 1
    const events = await secaServices.searchEvent(name, s, p)
    return res.json(events)
}

function createGroupProcessor(req, res) {
    
}

function updateGroupProcessor(req, res) {
 
}

function getAllGroupsProcessor(req, res) {
 
}

function deleteGroupProcessor(req, res) {
 
}

function getGroupProcessor(req, res) {
 
}

function addToGroupProcessor(req, res) {
 
}

function removeFromGroupProcessor(req, res) {
 
}

function createUserProcessor(req, res) {
 
}


function getToken(req) {
    const token = req.get("Authorization")
    if(token) {
        return token.split(" ")[1]
    }
}