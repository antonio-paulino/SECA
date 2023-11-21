import * as ticketMaster from './tm-events-data.mjs' 
import * as secaData from './seca-data-mem.mjs'
import {Group, User} from './seca-classes.mjs'
import errors from './errors.mjs'


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
    const userID = getUserId(userToken)
    const group = getGroup(groupID, userID)
    return secaData.updateGroup(group)
}

export function createUser(username) {
    const user = new User(username)
    return secaData.addUser(user)
}


function getUserId(userToken) {
    return secaData.findUser(userToken)
}


function getGroup(id, token) {
    if(!validateUUID(id)) throw errors.INVALID_ARGUMENT(id)
    return
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