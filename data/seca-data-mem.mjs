import { Group, User } from "../seca-classes.mjs"
import errors from '../common/errors.mjs'
import crypto from 'crypto'

export let users = new Map

//create users for postman tests
const user1 = new User('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
const user2 = new User('user 2', "g5ab7d81-f7df-4d76-9acf-0d3c0c73439f")
users.set("e5ab7d81-f7df-4d76-9acf-0d3c0c73649f", user1)
users.set("g5ab7d81-f7df-4d76-9acf-0d3c0c73439f", user2)

export let groups = new Map

groups.set("a5ab7d81-f7df-4d76-9acf-0d3c0c73649f", new Group("Test group user 1", "This is a test group that belongs to user 1", user1, "a5ab7d81-f7df-4d76-9acf-0d3c0c73649f"))
groups.set("c5ab7d81-f7df-4d76-9acf-0d3c0c73649f", new Group("Test group user 2", "This is a test group that belongs to user 2", user2, "c5ab7d81-f7df-4d76-9acf-0d3c0c73649f"))

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

    console.log(event)

    const groupToAdd = groups.get(group.id)

    if(getEventIndex(group, event.id) >= 0) throw errors.ALREADY_EXISTS(event.name, `in ${group.name}`)

    groupToAdd.events.push(event)
    return groupToAdd

}

export function deleteGroup(group){
    return groups.delete(group.id)
}

export function addUser(user) {
    console.log(user)

    for(let [token, checkedUser] of users) {
        if(checkedUser.name == user.name) 
            throw errors.ALREADY_EXISTS(user.name, 'in users')
    }

    let newUser = new User(user.name, crypto.randomUUID())
    users.set(newUser.token, newUser)
    
    return newUser
}

export function findUser(userToken) {
    const user = users.get(userToken)
    if(user) return user
    throw errors.NOT_FOUND(`User`)
}


export function getGroup(id) {
    return groups.get(id) 
}


export function getEventIndex(group, eventID) {

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