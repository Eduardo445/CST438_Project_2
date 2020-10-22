// movies.spec.js
const supertest = require('supertest');
const app = require('../app');

describe("Testing the movies API", () => {
    it("tests our testing framework if it works", () => {
      expect(2).toBe(2);
    });


    it("tests the base route and returns true for status", async () => {

		const response = await supertest(app).get('/');

		expect(response.status).toBe(200);
		expect(response.body.status).toBe(true);

	});

});