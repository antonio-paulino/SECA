import * as secaServices from '../../services/seca-services.mjs'
import errorToHttp from '../errors-to-http-responses.mjs'
import errors from '../../common/errors.mjs'
import { Group } from '../../seca-classes.mjs'

export default function(secaServices) {

    return {
        getPopularEvents : processRequest(getPopularEventsProcessor),
        searchEvent : processRequest(searchEventProcessor),
        createUser : processRequest(createUserProcessor),
        createGroup : processRequest(createGroupProcessor, true),
        updateGroup : processRequest(updateGroupProcessor, true),
        getAllGroups : processRequest(getAllGroupsProcessor, true),
        deleteGroup : processRequest(deleteGroupProcessor, true),
        getGroup : processRequest(getGroupProcessor, true),
        addToGroup : processRequest(addToGroupProcessor, true),
        removeFromGroup : processRequest(removeFromGroupProcessor, true),
        getMoreDetails : processRequest(getEventDetails)
    }

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
    
    async function getEventDetails(req, res) {
        const id = req.params.id
        if(!id) throw errors.ARGUMENT_MISSING('id')
        const event = await secaServices.getMoreDetails(id)
        return res.json(event)
    }
    
    async function getPopularEventsProcessor(req, res) {
    
        const s = (req.query.s) ? req.query.s : 30
        const p = (req.query.p) ? req.query.p : 1
    
        if(!isValidIndex(s)) throw errors.INVALID_ARGUMENT('s')
        if(!isValidIndex(p)) throw errors.INVALID_ARGUMENT('p')
    
        const events = await secaServices.getPopularEvents(s, p)
        return res.json(events)
    
    }
    
    
    async function searchEventProcessor(req, res) {
    
        if(!req.query.name) throw errors.ARGUMENT_MISSING('Name')
    
        const name = req.query.name
        const s = (req.query.s) ? req.query.s : 30
        const p = (req.query.p) ? req.query.p : 1
    
        if(!isValidIndex(s)) throw errors.INVALID_ARGUMENT('s')
        if(!isValidIndex(p)) throw errors.INVALID_ARGUMENT('p')
    
        const events = await secaServices.searchEvent(name, s, p)
        return res.json(events)
    
    }
    
    async function createGroupProcessor(req, res, token) {
    
        if(!req.body.name || !req.body.description) throw errors.INVALID_BODY(req.body)
    
        const newGroup = new Group(req.body.name, req.body.description)
        const group = await secaServices.createGroup(newGroup, token)
    
        return res.status(201).json(group)
    
    }
    
    async function updateGroupProcessor(req, res, token) {
    
        if(!req.params.id) throw errors.ARGUMENT_MISSING('Id')
        if(!req.body.name || !req.body.description) throw errors.INVALID_BODY(req.body)
    
        const newGroup = new Group(req.body.name, req.body.description)
        const group = await secaServices.updateGroup(req.params.id, newGroup, token)
    
        return res.json(group)
    }
    
    async function getAllGroupsProcessor(req, res, token) {
        const groups = await secaServices.getAllGroups(token)
        res.json(groups)
    }
    
    async function deleteGroupProcessor(req, res, token) {
    
        if (!req.params.id) {
            throw errors.ARGUMENT_MISSING('Id');
        }
    
        await secaServices.deleteGroup(req.params.id, token);
    
        return res.json();
    
    }
    
    async function getGroupProcessor(req, res, token) {
    
        if (!req.params.id) {
            throw errors.ARGUMENT_MISSING('Id');
        }
    
        const group = await secaServices.getGroupServ(req.params.id, token)
      
        return res.json(group)
    
    }
    
    async function addToGroupProcessor(req, res, token) {
        
        if (!req.params.id) {
            throw errors.ARGUMENT_MISSING('Id');
        }
    
        if(!req.body.id) {
            throw errors.INVALID_BODY()
        }
    
        const group = await secaServices.addToGroup(req.params.id, req.body.id, token)
        
        return res.json(group)
    
    }
    
    async function removeFromGroupProcessor(req, res, token) {
        if (!req.params.groupID) throw errors.ARGUMENT_MISSING('Group id');
        if (!req.params.eventID) throw errors.ARGUMENT_MISSING('Event id');
    
        const newGroup = await secaServices.removeEventFromGroup(req.params.groupID, req.params.eventID, token)
    
        return res.json(newGroup)
    }
    
    async function createUserProcessor(req, res) {
    
        const username = req.body.username
    
        if(!username) throw errors.ARGUMENT_MISSING('Username')
    
        const user = await secaServices.createUser(username)
    
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
}
