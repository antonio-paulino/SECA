const { expect } = require('chai')


let secaData

let secaClasses
let errors



let username = 'asd123'
let token


let groupID
let groupname = "teste1"
let groupdescription = "grupo teste"
let userID = token




before(async () => {
    secaData = await import('../data/seca-data-mem.mjs')
    secaClasses= await import('../seca-classes.mjs')
    errors = await import  ('../common/errors.mjs')
});




describe('User functions test', () => {
    it('addUser function', () => {
      
        const user = new secaClasses.User(username, null);
        const finalUser = secaData.addUser(user);
        token = finalUser.token
  
        expect(finalUser.token).to.not.equal(null);
        expect(secaData.users).to.not.be.empty


    });
  
   /* it('add an existing user', () => {
        const users = new Map();
        const username = "asd123";
        const newUser = new secaClasses.User(username, null);
  
        const finalUser = secaData.addUser(newUser);

        users.set(finalUser.token, newUser);
  
        const otherUser = new secaClasses.User(username, null);
  
        const addingDuplicateUser = () => secaData.addUser(otherUser);
  
        let caughtError = addingDuplicateUser();
        
        expect(caughtError).to.exist;


        expect(caughtError.code).to.equal(errors.ERROR_CODES.USER_ALREADY_EXISTS);
        expect(caughtError.description).to.equal(`Username ${otherUser.name} is taken`);
  });*/

    it('findUser function', () => {

        const user = new secaClasses.User(username , token);
  
        const foundUser = secaData.findUser(user.token);

        userID = foundUser.token
        

        expect(foundUser).to.deep.equal(user)

    });

  
});



describe('Group functions test', () => {
    it('addGroup function', () => {

        const group = new secaClasses.Group(groupname,groupdescription, token)

        const addedGroup = secaData.addGroup(group)
        groupID = addedGroup.id

        expect(addedGroup.id).to.not.equal(null)
        expect(secaData.groups).to.not.be.empty

    });

    it('getGroup function', () => {
        const group = new secaClasses.Group(groupname, groupdescription, userID, groupID)
        expect(secaData.getGroup(groupID)).to.deep.equal(group)
    });

    it('updateGroup function', () => {
        newGroup = new secaClasses.Group("new name", "new description", userID, groupID)

        groupname = newGroup.name
        groupdescription = newGroup.description

        expect(secaData.updateGroup(newGroup)).to.deep.equal(newGroup)

    })
    it('deleteGroup function', () => {

        console.log(secaData.groups)
        const group = new secaClasses.Group(groupname, groupdescription, userID, groupID)

        secaData.deleteGroup(group)

        console.log(secaData.groups)

        expect(secaData.getGroup(group.id)).to.not.exist

    
    })
})
