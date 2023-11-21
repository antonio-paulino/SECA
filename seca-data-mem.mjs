import { Group, User } from "./seca-classes.mjs"
import errors from './errors.mjs'
import crypto from 'crypto'

let users = new Map
let groups = new Map

export function addGroup(group) {
    const newGroup = new Group(group.name, group.description, group.userID, crypto.randomUUID())
    groups.set(newGroup.id, newGroup)
    return newGroup
}

export function updateGroup(newGroup) {
    const group = groups.get(newGroup.id)
    group.name = newGroup.name
    group.description = newGroup.description
    return group
}

export function removeEvent(group, eventID) {

    const groupToRemove = groups.get(group.id)
    const eventIdx = getEventIndex(group, eventID) 

    if(eventIdx == -1) throw errors.NOT_FOUND(`Event with id ${eventID} in group ${group.name}`)

    groupToRemove.events.splice(eventIdx, 1)
    
    return groupToRemove

}

export function getGroups(user) {
    let userGroups = []
    for(let [token, checkedGroup] of groups) {
        if(checkedGroup.userID == user) 
            userGroups.push(checkedGroup)
    }
    return userGroups
}

export async function addEvent(group, event) {

    const groupToAdd = groups.get(group.id)

    if(getEventIndex(group, event.id) >= 0) throw errors.EVENT_ALREADY_IN_GROUP(event)

    groupToAdd.events.push(event)
    return groupToAdd

}

export function deleteGroup(group){
    return groups.delete(group.id)
}

export function addUser(user) {

    for(let [token, checkedUser] of users) {
        if(checkedUser.name == user.name) 
            throw errors.USER_ALREADY_EXISTS(user.name)
    }

    let newUser = new User(user.name, crypto.randomUUID())
    users.set(newUser.token, newUser)

    return newUser
}

export function findUser(userToken) {
    const user = users.get(userToken)
    if(user) return user
    throw errors.NOT_FOUND(`User with token ${userToken}`)
}


export function getGroup(id) {
    return groups.get(id) 
}


function getEventIndex(group, eventID) {

    let idx = -1
    let count = 0

    group.events.forEach(event => {
        if (event.id == eventID) {
            idx = count
            return idx
        }
        count++
    });

    return idx

}