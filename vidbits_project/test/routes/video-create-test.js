const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, parseTextAttributeFromHTML} = require('../test-utils');

describe("VIDEO", () => {

    beforeEach(connectDatabase);
    
    afterEach(disconnectDatabase);

    describe("POST /videos", () => {
        /*
         * 201 is no longer valid - this will now return 400 when no input is provided.
         * 
        it("returns 201 HTTP status", async () => {
            const response = await request(app).post('/videos').type('form');        
            assert.equal(response.status, 201);  
        });
        */

        it(" finds a video afterwards, and redirects to the page", async () => {
            var toCreate = {
                title: "My Title",
                description: "My Description",
                url: "My Url"
            }
            const response = await request(app).post('/videos').type('form').send(toCreate);       
            createdVideo = await Video.findOne({});
            
            // Found video has required fields
            assert.equal(createdVideo.title, toCreate.title);
            assert.equal(createdVideo.description, toCreate.description);
            assert.equal(createdVideo.url, toCreate.url);

            // Test redirect
            assert(response.redirect);
            assert.equal(response.status, 302);
        })

        it(" does not save videos when title field is missing, status 400, shows error, preserves values", async () => {
            var toCreate = {
                description: "My Description",
                url: "My Url"
            }
            const response = await request(app).post('/videos').type('form').send(toCreate);                   

            videos = await Video.find({});            
            assert.equal(videos.length, 0);

            assert.equal(response.status, 400);
            
            const form = parseTextFromHTML(response.text, "form");
            assert.include(form, '`title` is required');

            //other values are preserved            
            const descr = parseTextFromHTML(response.text, "#description-input");
            assert.equal(descr, toCreate.description);

            const url = parseTextAttributeFromHTML(response.text, "#url-input", 'value');
            assert.equal(url, toCreate.url);
        })

        /* 
         * not a requirement - check
         * 
        it(" does not save videos when description field is missing, status 400, shows error, preserves values", async () => {
            var toCreate = {
                title: "My Title",
                url: "My Url"
            }
            const response = await request(app).post('/videos').type('form').send(toCreate);                   

            videos = await Video.find({});            
            assert.equal(videos.length, 0);

            assert.equal(response.status, 400);
            
            const form = parseTextFromHTML(response.text, "form");
            assert.include(form, '`description` is required');
            
            //other values are preserved            
            var titleValue = parseTextAttributeFromHTML(
                response.text, '#title-input', 'value');
            assert.equal(titleValue, toCreate.title);                

            const url = parseTextAttributeFromHTML(response.text, "#url-input", 'value');
            assert.equal(url, toCreate.url);
        })
        */

        it(" does not save videos when url field is missing, status 400, shows error, preserves values", async () => {
            var toCreate = {
                title: "My Title",
                description: "My Description",
            }
            const response = await request(app).post('/videos').type('form').send(toCreate);                   

            videos = await Video.find({});            
            assert.equal(videos.length, 0);

            assert.equal(response.status, 400);
            
            const form = parseTextFromHTML(response.text, "form");
            assert.include(form, '`url` is required');
            
            //other values are preserved            
            var titleValue = parseTextAttributeFromHTML(response.text, '#title-input', 'value');
            assert.equal(titleValue, toCreate.title);                

            const descr = parseTextFromHTML(response.text, "#description-input");
            assert.equal(descr, toCreate.description);
        })
    });            
});