import {expect} from 'chai'
import * as secaData from '../data/seca-data-elastic.mjs'
import * as ticketMaster from '../data/tm-events-data.mjs'
import secaServicesInit from '../services/seca-services.mjs'
import secaApiInit from '../web/api/seca-web-api.mjs'


const secaServices = secaServicesInit(secaData, ticketMaster)
const webAPI = secaApiInit(secaServices)


import { Group, User } from '../seca-classes.mjs';


let groupID 
let user


describe('web-api -> Group functions', () => {
    it('Create User', async () => {
        
        const req = {
            body: {
                username: 'web-api Test',
            },
            get: (header) => {
                return undefined
            },
        };
        
  
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(201);
                return {
                    json: (result) => {
                        expect(result['user-token']).to.be.not.equal(undefined)
                        user = new User('web-api Test', result['user-token'], result.id)
                    },
                };
            },
        };

        await webAPI.createUser(req, res)

        expect(user.token).to.be.not.equal(undefined)

    }),
    
    it('Create Group', async () => {
        const req = {
            body: {
                name: 'Test Group',
                description: 'This is a test group.',
            },

            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
            },
        
        };
        
  
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(201);
                return {
                    json: (result) => {
                        user.id = result.userID.id
                        groupID = result.id
                        expect(result.id).to.be.not.equal(null)
                        expect(result.userID.token).to.deep.equal(user.token)
                    },
                };
            },
        };

        await webAPI.createGroup(req, res, "e5ab7d81-f7df-4d76-9acf-0d3c0c73649f")

        expect(groupID).to.be.not.equal(undefined)
    }),

    it('Update Group', async () => {

        const req={
            params:{
                id: groupID
            },
            body: {
                name: "updateTestWebApi",
                description: "grupoupdated" 
            },
            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
            },
        }

        const res = {
            json:(result) => {
                expect(result.name).to.equal("updateTestWebApi")
                expect(result.description).to.equal("grupoupdated")
                expect(result.userID.token).to.deep.equal(user.token)
            }
        }

        await webAPI.updateGroup(req,res,user.token)

    })

    it('Get all groups', async () => {
    
        const req = {

            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
            },

        }

        const expectedGroup = new Group('updateTestWebApi','groupoupdated',user.token,groupID)
        
        const res = {
            json:(result) =>{
                expect(expectedGroup in result)
                expect(result.lenght == 1)
            }
        }

        await webAPI.getAllGroups(req,res,user.token)

    }),

    it('Get Group', async () => {

        const expectedGroup = new Group('updateTestWebApi','groupoupdated', user.token, groupID)

        const req = {
            params: {
                id: groupID,
            },
            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
            },
            
        };

        const res = {
            json: (result) => {
                expect(result.id).to.deep.equal(expectedGroup.id)
                expect(result.userID).to.deep.equal(user)
            },
        }

        await webAPI.getGroup(req, res, user.token)
        
    })

    it('Add Event to group', async () => {

        const req = {

            params: {
                id: groupID, 
            },

            body: {
                id: 'G5dIZ9YmSXKWz', 
            },

            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
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

        await webAPI.addToGroup(req, res, user.token)

    })

    it('Remove Event From Group', async () => {

        const req = {

            params: {
                groupID: groupID, 
                eventID: 'G5dIZ9YmSXKWz', 
            },

            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
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
        
        await webAPI.removeFromGroup(req,res,user.token)
                
    })

    it('Delete Group', async () => {

        const req = {
            params: {
                id: groupID, 
            },

            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
            },
        };

        const removedGroup = new Group('updateTestWebApi', 'grupoupdated',user,groupID)

        let groups
        
        const res = {
                json: () => {
                        
                },
        };

        await webAPI.deleteGroup(req,res,user.token);

        const reqGetGroups = {

            get: (header) => {
                if (header.toLowerCase() === "authorization") {
                    return `Bearer ${user.token}`;
                }
            },

        }

        const resGetGroups = {
            json:(result) =>{
                groups = result
            }
        }

        
        await webAPI.getAllGroups(reqGetGroups,resGetGroups,user.token)

        expect(groups).to.not.include(removedGroup)

    })
    
})


