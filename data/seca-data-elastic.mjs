import { Group, User } from "../seca-classes.mjs"
import errors from '../common/errors.mjs'
import crypto from 'crypto'

const ELASTICSEARCH_URL = 'http://localhost:9200' 

await initElasticSearch() 

export async function initElasticSearch() {

    const user1 = new User('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f", '1')
    const user2 = new User('user 2', "d5ab7d81-f7df-4d76-9acf-0d3c0c73439f", '2')

    if(!await indexExists('users')) {

        await createIndex('users', {
            username: { type: "keyword"},
            token: { type: "text" }
        });

        await fetchElasticSearch(`${ELASTICSEARCH_URL}/users/_doc/${user1.id}`, 'POST', user1)
        await fetchElasticSearch(`${ELASTICSEARCH_URL}/users/_doc/${user2.id}`, 'POST', user2)
   
    }

    if(!await indexExists('groups')) {
        await createIndex('groups', {
            id: {type : 'keyword'},
            userID: { 
                properties: {
                    id: { type: "keyword" },
                    name: { type: "text" },
                    token: { type: "text"}
               } 
            },
            name: { type: "text" },
            description: { type: "text" },
            events: {
              type: "nested",
              properties: {
                id: { type : "keyword" },
                name: { type: "text" },
                date: { type: "date" },
                genre: { type: "keyword" },
                segment: { type: "keyword" }
              }
            }
        })


        const group1 = new Group("Test group user 1", "This is a test group that belongs to user 1", user1, "a5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
        const group2 = new Group("Test group user 2", "This is a test group that belongs to user 2", user2, "c5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
        await fetchElasticSearch(`${ELASTICSEARCH_URL}/groups/_doc/${group1.id}`, 'POST', group1)
        await fetchElasticSearch(`${ELASTICSEARCH_URL}/groups/_doc/${group2.id}`, 'POST', group2)

    }

}

export async function fetchElasticSearch(url, method, body = null) {

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });
        
        return response
    } catch (error) {
        console.log(error)
    }
        
}

async function indexExists(indexName) {
    const response = await fetchElasticSearch(`${ELASTICSEARCH_URL}/${indexName}`, 'HEAD')
    return response.ok
}

async function createIndex(indexName, objProperties) {
    await fetchElasticSearch(`${ELASTICSEARCH_URL}/${indexName}`, 'PUT', {
        mappings: {
            properties: objProperties
        },
    })
}

async function createDocument(indexName, body) {
    const res = await fetchElasticSearch(`${ELASTICSEARCH_URL}/${indexName}/_doc?refresh`, 'POST', body)
    return await res.json()
}

async function getDocument(indexName, docID) {
    const res = await fetchElasticSearch(`${ELASTICSEARCH_URL}/${indexName}/_doc/${docID}`, 'GET')
    if(res.status == 404) return null
    return await res.json()
}

async function updateDocument(indexName, docID, body) {
    const res = await fetchElasticSearch(`${ELASTICSEARCH_URL}/${indexName}/_update/${docID}?refresh`, 'POST', body)
    return await res.json()
}

async function searchDocument(indexName, body) {
    let method = (body) ? 'POST' : 'GET'
    let url = (indexName) ? `${ELASTICSEARCH_URL}/${indexName}/_search/` : `${ELASTICSEARCH_URL}/_all`
    const res = await fetchElasticSearch(url, method, body)
    return await res.json()
}

async function deleteDocument(indexName, docID) {
    await fetchElasticSearch(`${ELASTICSEARCH_URL}/${indexName}/_doc/${docID}?refresh`, `DELETE`)
}

export async function addGroup(group) {
    const newGroup = new Group(group.name, group.description, group.userID)
    const res = await createDocument('groups', newGroup)
    newGroup.id = res._id
    return newGroup
}

export async function updateGroup(newGroup) {

    await updateDocument('groups', newGroup.id, {
        doc: {
            name: newGroup.name,
            description: newGroup.description,
        },
    })
    return newGroup 

}


export async function getGroup(id) {

        const res = await getDocument('groups', id)

        if(res == null) return null

        res._source.id = res._id
        return res._source

}


export async function getAllGroups() {

    let groups = []

    const res = await searchDocument('groups')

    res.hits.hits.forEach(group => {
        group._source.id = group._id
        groups.push(group._source)
    })

    return groups
}

export async function getGroups(user) {

    let groups = []

    const res = await searchDocument('groups', {
        query: {
            term: { 'userID.id': user.id },
        },
    })
    
    res.hits.hits.forEach(group => {
        group._source.id = group._id
        groups.push(group._source)
    })

    return groups
    
}

export async function addEvent(group, event) {

    if(getEventIndex(group, event.id) >= 0) throw errors.ALREADY_EXISTS(event.name, `in ${group.name}`)
    const groupToAdd = await getGroup(group.id)

    groupToAdd.events.push(event)

    await updateDocument('groups', groupToAdd.id, {
        doc: {
            events: groupToAdd.events
        },
    })
 
    return groupToAdd

}


export async function removeEvent(group, eventID) {

    const groupToRemove = await getGroup(group.id)
 
    const eventIdx = getEventIndex(group, eventID) 

    if(eventIdx == -1) throw errors.NOT_FOUND(`Event with id ${eventID} in group ${group.name}`)

    groupToRemove.events.splice(eventIdx, 1)

    await updateDocument('groups', groupToRemove.id, {
        doc: {
            events: groupToRemove.events
        },
    })

    return groupToRemove

}

export async function deleteGroup(group) {
    await deleteDocument('groups', group.id)
}

export async function addUser(user) {

    const res = await searchDocument(`users`, {
        query: {
            term: { 'name.keyword': user.name }, 
        },
    })

    if (res.hits.total.value > 0) {
        throw errors.ALREADY_EXISTS(user.name, 'in users')
    }

    const newUser = new User(user.name, crypto.randomUUID())

    const userRes = await createDocument('users', newUser)

    newUser.id = userRes._id
    

    return newUser
}

export async function findUser(userToken) {

    const res = await searchDocument('users', {
        query: {
            match: { 'token': userToken }, 
        },
    })
    
    const userWithToken = res.hits.hits.filter(user => {
        return user._source.token == userToken
    })
    
    if (userWithToken.length == 0) {
        throw errors.NOT_FOUND(`User with token ${userToken}`, 'in users')
    }

    let user = userWithToken[0]._source
    user.id = userWithToken[0]._id

    return user
    
}


export function getEventIndex(group, eventID) {

    for (let i = 0; i < group.events.length; i++) {
        if (group.events[i].id === eventID) {
            return i 
        }
    }
    
    return -1
    
}
