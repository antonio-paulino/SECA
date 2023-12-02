import {expect} from 'chai'

import * as secaServices from '../services/seca-services.mjs';
import { Group, User } from '../seca-classes.mjs';



let groupID

describe('validateUUID function', () => {
  it('should return false for a valid UUID', () => {
    const validUUID = '0123456789abcdef0123456789abcdef';
    expect(secaServices.validateUUID(validUUID)).to.be.false;
  });

  it('should return true for a valid UUID', () => {
    const validUUID = 'dc83a0ca-445d-4d24-bc1e-171b9f105a7f';
    expect(secaServices.validateUUID(validUUID)).to.be.true;
  });

});

describe ('Group - services functions', () => {

  it('should create a group successfully', () => {
    // Arrange
    const newGroup = {
        name: 'Test Group',
        description: 'Test Description'
    };
    const userToken = 'e5ab7d81-f7df-4d76-9acf-0d3c0c73649f';

    // Act
    const createdGroup = secaServices.createGroup(newGroup, userToken);
    groupID = createdGroup.id
    expect(createdGroup.id).to.not.equal(null);
    
});


  it('getGroup function', () => {

    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    
    const group = new Group('Test Group', 'Test Description',user,groupID)

    expect(secaServices.getGroup(groupID,user)).to.deep.equal(group);

  })
  

  it('getAllGroups function', () =>{
    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    const groupPrevCreated = new Group('Test Group', 'Test Description',user,groupID)
    const groups = secaServices.getAllGroups(user.token);
    expect(groupPrevCreated in groups)
  })

  it('updateGroup function', () =>{
    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    const expectedGroup = new Group('updatetest1', 'grupoupdated',user,groupID)

    const newGroup ={
      "name": "updatetest1",
      "description": "grupoupdated" 
    }
    const updatedGroup = secaServices.updateGroup(groupID,newGroup,user.token)

    expect(updatedGroup).to.be.deep.equal(expectedGroup)

  })

  it('addToGroup function', async () =>{

    let event ={
      id: 'G5dIZ9YmSXKWz',
      name: 'San Antonio Spurs vs. Phoenix Suns',
      date: '2024-03-26T00:00:00Z',
      genre: 'Basketball',
      segment: 'Sports'
    }
    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    let group = secaServices.getGroup(groupID, user)
    await secaServices.addToGroup(groupID,event.id,user.token)
  
   
    expect(group.events).to.not.empty
    expect(group.events).to.deep.include(event)

  })

  it('getGroupServ function', () =>{
    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    const expectedGroup = new Group('updatetest1', 'grupoupdated',user,groupID)
    
    const returnedGroup = secaServices.getGroupServ(groupID, user.token)

    expect(returnedGroup.id).to.be.deep.equal(expectedGroup.id)
    expect(returnedGroup.userID).to.be.deep.equal(expectedGroup.userID) 
  })

  it('removeEventFromGroup function', () =>{
    let event ={
      id: 'G5dIZ9YmSXKWz',
      name: 'San Antonio Spurs vs. Phoenix Suns',
      date: '2024-03-26T00:00:00Z',
      genre: 'Basketball',
      segment: 'Sports'
    }
    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    // Using the same user like the tests before. At this point the user has one group and one event on it. 
    const returnedGroup = secaServices.removeEventFromGroup(groupID, event.id,user.token)
    
    expect(returnedGroup.events).to.not.include(event)

  })

  it('deleteGroup function', () => {
    const user = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    const removedGroup = new Group('updatetest1', 'grupoupdated',user,groupID)

    secaServices.deleteGroup(groupID,user.token)
    const groups = secaServices.getAllGroups(user.token)
    expect(groups).not.include(removedGroup)

  })

})


describe('validateUUID function', () => {
  it('createUser function', () => {
    const username = "testUser"
    let returnedUser = secaServices.createUser(username)
    expect(returnedUser).to.have.property('name').to.equal(username)
    expect(returnedUser).to.have.property('token')
  })
  it('getUserId function',() =>{
    const userToken = 'e5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
    const expectedUser = new User ('user 1', "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")
    expect(secaServices.getUserId(userToken)).to.deep.equal(expectedUser)
  })

})