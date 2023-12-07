
import * as secaData from '../data/seca-data-elastic.mjs'
import * as secaClasses from '../seca-classes.mjs'

import { assert, expect, use } from 'chai'



let username = 'asd123'
let token


let groupID
let groupname = "teste1"
let groupdescription = "grupo teste"
let userToken
let userID

let testUser

before(async () => {
    await secaData.fetchElasticSearch('http://localhost:9200/groups/', 'DELETE')
    await secaData.fetchElasticSearch('http://localhost:9200/users/', 'DELETE')
    await secaData.initElasticSearch()
})


describe('User - ElasticSearch Data functions test', async () => {

    it('addUser function', async () => {
        const user = new secaClasses.User(username, null);
        const finalUser = await secaData.addUser(user);
        token = finalUser.token
        userID = finalUser.id
        testUser = finalUser
        expect(finalUser.token).to.not.equal(null);
        expect(finalUser.id).to.not.equal(null);
    });
  
    it('add an existing user', async () => {
        const username = "DuplicateTest"
        
        const newUser = new secaClasses.User(username)

        await secaData.addUser(newUser)

        const otherUser = new secaClasses.User(username)
        
        try {
            await secaData.addUser(otherUser)
        } catch (error) {
            expect(error).to.deep.equal( {code: 4, description: `DuplicateTest already exists in users`} )
        }

    })

    it('findUser function', async  () => {
        const user = new secaClasses.User(username, token, userID)
        const foundUser = await secaData.findUser(user.token)
        userToken = foundUser.token
        expect(foundUser).to.deep.equal(user)
    });

  
});



describe('Group - ElasticSearch Data functions test', () => {

    it('addGroup function', async () => {

        const group = new secaClasses.Group(groupname, groupdescription, testUser)
        const addedGroup = await secaData.addGroup(group)
        groupID = addedGroup.id
        expect(addedGroup.id).to.not.equal(null)
        
    });

    it('getGroup function', async () => {
        const group = new secaClasses.Group(groupname, groupdescription, testUser, groupID)
        let resGroup = await secaData.getGroup(groupID)
        expect(resGroup).to.deep.equal(group)
    });

    it('updateGroup function', async () => {

        
        let newGroup = new secaClasses.Group("new name", "new description", testUser, groupID)

        groupname = newGroup.name
        groupdescription = newGroup.description

        expect(await secaData.updateGroup(newGroup)).to.deep.equal(newGroup)

    })
    it('deleteGroup function', async () => {

        const group = new secaClasses.Group(groupname, groupdescription, testUser, groupID)

        await  secaData.deleteGroup(group)

        expect(await secaData.getGroup(group.id)).to.not.exist
    
    })
})



// using one of the existing users by default

describe('Event - ElasticSearch Data functions test', () =>{
    
    it('addEvent function', async () => {

        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        
        let event ={
            id: 'G5dIZ9YmSXKWz',
            name: 'San Antonio Spurs vs. Phoenix Suns',
            date: '2024-03-26T00:00:00Z',
            genre: 'Basketball',
            segment: 'Sports'
          }
        
        let group = await secaData.getGroup(localGroupID)
        
        let addedGroup = await secaData.addEvent(group,event)

        expect(addedGroup.events).to.not.empty

        expect(addedGroup.events).to.deep.equal([event])

        
    })

    it('getEventIndex function - existing event', async () =>{
        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEventID = 'G5dIZ9YmSXKWz'
        let group = await secaData.getGroup(localGroupID)
        expect(secaData.getEventIndex(group, localEventID)).to.be.equal(0)

    })

    it('removeEvent function - existing event', async () =>{
        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEventID = 'G5dIZ9YmSXKWz'
        let group = await secaData.getGroup(localGroupID)
        let removedGroup = await secaData.removeEvent(group, localEventID)
        expect(removedGroup.events).to.be.empty
    })

    //now the event got removed


    it('getEventIndex function - non existing event', async () =>{

        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEventID = 'G5dIZ9YmSXKWz'
        let group = await secaData.getGroup(localGroupID)
        expect(secaData.getEventIndex(group, localEventID)).to.be.equal(-1)

    })

    it('removeEvent function - non existing event', async () => {
        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEventID = 'G5dIZ9YmSXKWz'
        let group = await secaData.getGroup(localGroupID)

        try {
            await secaData.removeEvent(group, localEventID)
        } catch (error) {
            expect(error).to.deep.equal({code: 3, description: `Event with id ${ localEventID } in group ${group.name} not found` })
        }
       
    })

})
