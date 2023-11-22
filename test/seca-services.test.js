const { expect } = require('chai')

let secaServices;

before(async () => {
  // Use dynamic import to import the ES module
  secaServices = await import('../services/seca-services.mjs');
});

describe('validateUUID function', () => {
  it('should return false for invalid UUID', () => {
    const validUUID = '0123456789abcdef0123456789abcdef';
    expect(secaServices.validateUUID(validUUID)).to.be.false;
  });

  it('should return true for a valid UUID', () => {
    const validUUID = 'dc83a0ca-445d-4d24-bc1e-171b9f105a7f';
    expect(secaServices.validateUUID(validUUID)).to.be.true;
  });

});

