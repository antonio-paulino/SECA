import {expect} from 'chai'

import * as webAPI from '../web-api/seca-web-api.mjs';

import { Group, User } from '../seca-classes.mjs';


let groupID 


describe('web-api -> createGroupProcessor', () => {
    it('should create a group and return it in the response', () => {
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const req = {
            body: {
                name: 'Test Group',
                description: 'This is a test group.',
            }
        };
        
  
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(201);
                return {
                    json: (result) => {
                        groupID =result.id
                        expect(result.id).to.be.not.equal(null)
                        expect(result.userID.token).to.deep.equal(user.token)
                    },
                };
            },
        };
        webAPI.createGroupProcessor(req, res, "3ac4a280-42be-460c-b6a7-6f008b69cac1");
    })
})
// On the next test, we will use the group previously created (by testing createGroupProcessor), by using it's id 
describe('web-api -> updateGroupProcessor', () =>{
    it('should update a group with the provided data', ()=>{
        // same user as last test
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const req={
            params:{
                id: groupID
            },
            body: {
                name: "updateTestWebApi",
                description: "grupoupdated" 
            }
        }
        const res = {
            json:(result) => {
                expect(result.name).to.equal("updateTestWebApi");
                expect(result.description).to.equal("grupoupdated");
            }
        }
        webAPI.updateGroupProcessor(req,res,user.token)
    })
})
describe('web-api -> getAllGroupsProcessor', () =>{
    it('should get all groups from a single user', () =>{
        // 'web-api Test' user will only have one group
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const expectedGroup = new Group('updateTestWebApi','groupoupdated',user.token,groupID)
        
        const res = {
            json:(result) =>{
                expect(expectedGroup in result)
                expect(result.lenght == 1)
            }
        }
        webAPI.getAllGroupsProcessor(null,res,user.token)
    })
})
describe('web-api -> getGroupProcessor', () => {
    it('should retrieve a group and return it in the response', () => {
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const expectedGroup = new Group('updateTestWebApi','groupoupdated',user.token,groupID)
        const req = {
            params: {
              id: groupID,
            },
        }
    
        const res = {
            json: (result) => {
                expect(result.id).to.deep.equal(expectedGroup.id)
                expect(result.userID).to.deep.equal(user)
          },
        }
        webAPI.getGroupProcessor(req, res, user.token);
    })
})


describe('web-api -> addToGroupProcessor', () => {
    it('should add an event to a group and return the updated group in the response', async () => {
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const req = {
            params: {
                id: groupID, 
            },
            body: {
                id: 'G5dIZ9YmSXKWz', 
            },
        };

        let event ={
            id: 'G5dIZ9YmSXKWz',
            name: 'San Antonio Spurs vs. Phoenix Suns',
            date: '2024-03-26T00:00:00Z',
            genre: 'Basketball',
            segment: 'Sports'
        }

  
        const res = {
            json: (result) => { 
                expect(event in result.events)
            },
        };
        await webAPI.addToGroupProcessor(req,res, user.token)

    })
})


describe('web-api -> removeFromGroupProcessor', () => {
    it('should remove an event from a group and return the updated group in the response', () => {
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const req = {
            params: {
                groupID: groupID, // Replace with a valid group ID for your test case
                eventID: 'G5dIZ9YmSXKWz', // Replace with a valid event ID for your test case
            },
        };

        let event ={
            id: 'G5dIZ9YmSXKWz',
            name: 'San Antonio Spurs vs. Phoenix Suns',
            date: '2024-03-26T00:00:00Z',
            genre: 'Basketball',
            segment: 'Sports'
        }
  
        const res = {
            json: (result) => {
                expect(result.events).to.not.include(event)
            },
        };
        webAPI.removeFromGroupProcessor(req,res,user.token);

    })
})
describe('web-api -> deleteGroupProcessor', () => {
    it('should delete a group and return a 200 status in the response', () => {
        const user = new User ('web-api Test', "3ac4a280-42be-460c-b6a7-6f008b69cac1")
        const req = {
            params: {
                id: groupID, // Replace with a valid group ID for your test case
            },
        };
        const removedGroup = new Group('updateTestWebApi', 'grupoupdated',user,groupID)

        let groups
        
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(200);
                return {
                    json: () => {
                        
                    },
                };
            },
        };
        webAPI.deleteGroupProcessor(req,res,user.token);

        const resGetGroups = {
            json:(result) =>{
                groups = result
            }
        }
        
        webAPI.getAllGroupsProcessor(null,resGetGroups,user.token)
        expect(groups).to.not.include(removedGroup)

    })
})