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
    if(user) return user.token
    throw errors.USER_NOT_FOUND()
}