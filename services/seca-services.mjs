import {Group, User} from '../seca-classes.mjs'
import errors from '../common/errors.mjs'

export default function(secaData, ticketMaster) {
    return {
        getPopularEvents: getPopularEvents,
        searchEvent: searchEvent,
        getMoreDetails: getMoreDetails,
        createGroup: createGroup,
        updateGroup: updateGroup,
        getAllGroups: getAllGroups,
        createUser: createUser,
        deleteGroup: deleteGroup,
        getGroupServ: getGroupServ,
        addToGroup: addToGroup,
        removeEventFromGroup: removeEventFromGroup,
        getUserId: getUserId,
        getGroup: getGroup,
        validateUUID: validateUUID,
        validateUser: validateUser
    }
     async function getPopularEvents(s, p) {
        return await ticketMaster.getPopularEvents(s, p)
    }
    
     async function searchEvent(name, s, p) {
        return await ticketMaster.searchEvent(name, s, p)
    }
    
     async function getMoreDetails(id) {
        return await ticketMaster.getEventByID(id, true)
    }
    
     async function createGroup(newGroup, userToken) {
        const userID = await getUserId(userToken)
        const group = new Group(newGroup.name, newGroup.description, userID)
        return await secaData.addGroup(group)
    }
    
     async function updateGroup(groupID, newGroup, userToken) {
        const user = await getUserId(userToken)
        const group = await getGroup(groupID, user)
        group.name = newGroup.name
        group.description = newGroup.description
        return await secaData.updateGroup(group)
    }
    
     async function getAllGroups(userToken) {
        const user = await getUserId(userToken)
        return await secaData.getGroups(user)
    }
    
     async function createUser(username, password) {
        const user = new User(username)
        user.password = password
        return await secaData.addUser(user)
    }
    
     async function deleteGroup(groupId,token) {
        const user = await getUserId(token)
        const removedGroup = await getGroup(groupId,user)
        return await secaData.deleteGroup(removedGroup)
    }
    
     async function getGroupServ(groupID, token) {
        const user = await getUserId(token)
        const group = await getGroup(groupID, user)
        return group
    }
    
     async function addToGroup(groupID, eventID, token) {
        const user = await getUserId(token)
        const group = await getGroup(groupID, user)
        const event = await ticketMaster.getEventByID(eventID)
        return await secaData.addEvent(group, event)
    }
    
     async function removeEventFromGroup(groupId, eventId, token){
        const user = await getUserId(token)
        const group = await getGroup(groupId, user)
        return await secaData.removeEvent(group, eventId)
    }
    
    
     async function getUserId(userToken) {
        if(!validateUUID(userToken)) throw errors.INVALID_ARGUMENT(userToken)
        return await secaData.findUser(userToken)
    }
    
    
     async function getGroup(groupID, user) {
    
        const group = await secaData.getGroup(groupID)
        if(!group) throw errors.NOT_FOUND(`Group with id ${groupID}`)
        if (group.userID.token != user.token) throw errors.NOT_AUTHORIZED(`User ${user.name}`, group.name)
        return group
    
    }

    async function validateUser(username, password) {
        return await secaData.findUserLogin(username, password)
    }
    
    
     function validateUUID(str) {
        
        let countNums = 0
        let countSep = 0
    
        for(let i in str) {
            if(str[i] >= '0' &&  str[i] <= '9' || str[i] >= 'A' &&  str[i] <= 'F' || str[i] >= 'a' &&  str[i] <= 'f') {
                countNums++
            }
            else if(str[i] == '-') {
                countSep++
            }
            else return false
        }
    
        if(countNums == 32 && countSep == 4) return true
    
        return false
    
    }
}


