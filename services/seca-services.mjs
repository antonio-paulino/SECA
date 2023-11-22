import * as ticketMaster from '../data/tm-events-data.mjs' 
import * as secaData from '../data/seca-data-mem.mjs'
import {Group, User} from '../seca-classes.mjs'
import errors from '../common/errors.mjs'


export async function getPopularEvents(s, p) {
    return await ticketMaster.getPopularEvents(s, p)
}

export async function searchEvent(name, s, p) {
    return await ticketMaster.searchEvent(name, s, p)
}


export function createGroup(newGroup, userToken) {
    const userID = getUserId(userToken)
    const group = new Group(newGroup.name, newGroup.description, userID)
    return secaData.addGroup(group)
}

export function updateGroup(groupID, newGroup, userToken) {
    const user = getUserId(userToken)
    const group = getGroup(groupID, user)
    group.name = newGroup.name
    group.description = newGroup.description
    return secaData.updateGroup(group)
}

export function getAllGroups(userToken) {
    const user = getUserId(userToken)
    return secaData.getGroups(user)
}

export function createUser(username) {
    const user = new User(username)
    return secaData.addUser(user)
}

export function deleteGroup(groupId,token) {
    const user = getUserId(token)
    const removedGroup = getGroup(groupId,user)
    return secaData.deleteGroup(removedGroup)
}

export function getGroupServ(groupID, token) {
    const user = getUserId(token)
    const group = getGroup(groupID, user)
    return group
}

export async function addToGroup(groupID, eventID, token) {
    const user = getUserId(token)
    const group = getGroup(groupID, user)
    const event = await ticketMaster.getEventByID(eventID)
    return await secaData.addEvent(group, event)
}

export function removeEventFromGroup(groupId, eventId, token){
    const user = getUserId(token)
    const group = getGroup(groupId, user)
    return secaData.removeEvent(group, eventId)
}


function getUserId(userToken) {
    if(!validateUUID(userToken)) throw errors.INVALID_ARGUMENT(userToken)
    return secaData.findUser(userToken)
}


function getGroup(groupID, user) {

    if(!validateUUID(groupID)) throw errors.INVALID_ARGUMENT(groupID)
    const group = secaData.getGroup(groupID)
    if(!group) throw errors.NOT_FOUND(`Group with id ${groupID}`)
    if (group.userID.token != user.token) throw errors.NOT_AUTHORIZED(`User ${user.name}`, group.name)
    return group

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