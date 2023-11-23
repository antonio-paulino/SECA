import expect from 'chai'

import * as secaServices from ('../services/seca-services.mjs');


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

  it('createGroup function'), () => {

  }


  it('getGroup function')
  

  it('getAllGroups function')

  it('updateGroup function')

  it('addToGroup function')

  it('getGroupServ function')

  it('removeEventFromGroup function')


  it('deleteGroup function')










})


describe ('Users - services functions',() =>{
  it('')









})
