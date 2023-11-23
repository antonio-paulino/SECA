import {assert, expect} from 'chai'
import * as errors from '../common/errors.mjs'
import * as ticketmaster from '../data/tm-events-data.mjs'

describe('search events', () => {

    it('should get popular events', async () => {

        let result = await ticketmaster.getPopularEvents(10, 1);
        expect(result.length).to.equal(10);

        result.forEach((event) => {
            assert.isObject(event)
            assert.hasAllKeys(event, ["id", "name", "date", "genre", "segment"])
        })

        result = await ticketmaster.getPopularEvents(23, 3);

        result.forEach((event) => {
            assert.isObject(event)
            assert.hasAllKeys(event, ["id", "name", "date", "genre", "segment"])
        })

        expect(result.length).to.equal(23);

        
    });

    it('should throw bad request', async () => {

        let err 
        try {
            await ticketmaster.getPopularEvents(-1, 1)
        } catch (error) {
            err = error
        }
        
        assert.deepEqual(err, {code: 6, description:`Bad Request`, status: 400})

        try {
            await ticketmaster.getPopularEvents(1, -6)
        } catch (error) {
            err = error
        }
        
        assert.deepEqual(err, {code: 6, description:`Bad Request`, status: 400})

    });

    it('should get events by name', async () => {

        let result = await ticketmaster.searchEvent("football", 5, 1);

        expect(result.length).to.equal(5);

        result.forEach((event) => {
            assert.isObject(event)
            assert.hasAllKeys(event, ["id", "name", "date", "genre", "segment"])
        })
        
        assert.isTrue(result.some((event) => event.name.toLowerCase().includes("football") || event.genre.toLowerCase().includes("football")))
        assert.isFalse(result.some((event) => event.name.toLowerCase().includes("hockey") || event.genre.toLowerCase().includes("hockey")))

        result = await ticketmaster.searchEvent("hockey", 5, 1);

        result.forEach((event) => {
            assert.isObject(event)
            assert.hasAllKeys(event, ["id", "name", "date", "genre", "segment"])
        })

        assert.isTrue(result.some((event) => event.name.toLowerCase().includes("hockey") || event.genre.toLowerCase().includes("hockey")))
        assert.isFalse(result.some((event) => event.name.toLowerCase().includes("football") || event.genre.toLowerCase().includes("football")))

        expect(result.length).to.equal(5);

        
    });


    it('should get events by id', async () => {

        let result = await ticketmaster.getEventByID("G5v0Z9Yc3YZz9");

 
        assert.isObject(result)
        assert.hasAllKeys(result, ["id", "name", "date", "genre", "segment"])
 
        
        result = await ticketmaster.getEventByID("vvG1jZ9MdsQVHo");

       
        assert.isObject(result)
        assert.hasAllKeys(result, ["id", "name", "date", "genre", "segment"])
        

    });


})