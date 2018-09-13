const {assert} = require('chai');
/*
var chai  = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
*/
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, generateRandomUrl, parseTextAttributeFromHTML} = require('../test-utils');

describe("/videos", () => {

    beforeEach(connectDatabase);
    
    afterEach(disconnectDatabase);

    describe("Get /", () => {

        it(" redirects to /videos", async () => {
            var toCreate = {
                title: "My Title",
                description: "My Description",
                url: generateRandomUrl('my-domain')
            }
            const response = await request(app).post('/videos').type('form').send(toCreate);       
            
            const response2 = await request(app).get('/');
            assert.equal(response2.status, 302);
            //console.log(response2.text);
            assert.include(response2.text, 'Redirecting to /videos');
        })
    });            

    describe("Get /videos", () => {

        it(" finds existing videos", async () => {
            var toCreate = {
                title: "My Title",
                description: "My Description",
                url: generateRandomUrl('my-domain')
            }
            const response = await request(app).post('/videos').type('form').send(toCreate);       

            const response2 = await request(app).get('/videos');            
            //console.log(response2.text);

            const videos_container = parseTextFromHTML(response2.text, '#videos-container') ;
            assert.include(videos_container, toCreate.title);
            //assert.include(videos_container, toCreate.description);  // not a requirement
            
            var url = parseTextAttributeFromHTML(response2.text, 'iframe', 'src');
            assert.equal(url, toCreate.url);
        })
    });            

    describe("Get /videos/${video._id}", () => {
        it("finds a video in the database", async () => {      
        
            var toCreate = new Video({
                title: "My Title",
                description: "My Description",
                url: generateRandomUrl('my-domain')
            });            

            var created = await Video.create(toCreate);
            
            const response = await request(app).get('/videos/' + created._id);
            //console.log(response.text);

            assert.include(parseTextFromHTML(response.text, '#title'), created.title);
            assert.include(parseTextFromHTML(response.text, '#description'), created.description);

            var url = parseTextAttributeFromHTML(response.text, 'iframe', 'src');
            assert.equal(url, toCreate.url);
        }) 
    })        

    describe("Get /videos/${video._id}/edit", () => {
        it("finds a video in the database, displays it for editing and updates rather than inserts", async () => {              
        
            var toCreate = new Video({
                title: "My Title",
                description: "My Description",
                url: generateRandomUrl('my-domain')
            });        
            var originalTitle = toCreate.title;    

            var created = await Video.create(toCreate);
            
            const response = await request(app).get('/videos/' + created._id + '/edit' );
            //console.log(response.text);

            // Found video has required fields
            assert.equal(parseTextAttributeFromHTML(response.text,'#title-input', 'value'), toCreate.title);
            assert.equal(parseTextFromHTML(response.text, '#description-input'), toCreate.description);
            assert.equal(parseTextAttributeFromHTML(response.text, '#url-input', 'value'), toCreate.url);    

            // Update fields and set in the form
            created.title += ' updated';
            created.description += ' updated';
            created.url += '-updated';

            //POST
            //console.log(JSON.stringify(created));
            
            const response2 = await request(app)
                .post('/videos/' + created.id + '/updates')
                .type('form')
                //.send(created);   // doesn't work causes stack overflow :-(
               .send({title: created.title, description: created.description, url:created.url});

            //console.log("response2.text: ", response2.text);
            //console.log('status:',response2.status);
            assert.equal(response2.status, 302);

            /*
            await chai.request(app)
                    .post('/videos/' + created.id + '/updates')
                    .type('form')                       
                    //.set('content-type', 'application/x-www-form-urlencoded')                    
                    
                    //.send(created) - should be able to do this but it causes stack error !! so do the following instead :-(
                    .send({title: created.title, description: created.description, url:created.url})
                    .end( function (err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                    });
                    */

             // We can find the updated video by title   
             var updatedVideo = await Video.findOne({title: created.title});
             //console.log(updatedVideo);
             assert(updatedVideo, "New title should be present in the database", created.title);
    
            // We can't find the old video by title   
            var search = {title: originalTitle};
            var originalVideo = await Video.findOne(search);
            //console.log('originalVideo:', originalVideo);
            assert.isNull(originalVideo, "Old title shouldn't be present in the database - " + JSON.stringify(search));
        });
        
        it("does not save invalid data, resturns status 400 and renders the edit page with the error message with previous values populated", async () => {              
        
            var toCreate = new Video({
                title: "My Title",
                description: "My Description",
                url: generateRandomUrl('my-domain')
            });        
            var originalTitle = toCreate.title;    

            var created = await Video.create(toCreate);
            
            const response = await request(app).get('/videos/' + created._id + '/edit' );

            // Update fields and set in the form
            created.title = '';

            //POST
            //console.log(JSON.stringify(created));
            url = '/videos/' + created.id + '/updates';
            const response2 = await request(app)
                .post(url)
                .type('form')
                //.send(created);   // doesn't work causes stack overflow :-(
               .send({title: created.title, description: created.description, url:created.url});

            //console.log(response2);

             // We can't find the updated video by original title   
             var updatedVideo = await Video.findOne({title: created.title});
             assert.isNull(updatedVideo, "New title should NOT be present in the database", created.title);
    
            // We can't find the old video by title   
            var search = {title: originalTitle};
            var originalVideo = await Video.findOne(search);
            //console.log('originalVideo:', originalVideo);
            assert(originalVideo, "Old title shouldn't be present in the database - " + JSON.stringify(search));

            //console.log("response2.text: ", response2.text);
            //console.log('status:',response2.status);
            assert.equal(response2.status, 400);

            // Same page re-displays showing the same form action
            assert.equal(parseTextAttributeFromHTML(response.text,'form', 'action'), url);

            // inputs are populated.
            assert.equal(parseTextAttributeFromHTML(response2.text,'#title-input', 'value'), created.title);
            assert.equal(parseTextFromHTML(response2.text, '#description-input'), created.description);
            assert.equal(parseTextAttributeFromHTML(response2.text, '#url-input', 'value'), created.url);    
            
            // error shows
            assert.include(response2.text, 'Path &#x60;title&#x60; is required.');

        });        
    });            

    describe("Post /videos/${video._id}/delete", () => {

        it("deletes a video from the database", async () => {  
            var toCreate = new Video({
                title: "My Title",
                description: "My Description",
                url: generateRandomUrl('my-domain')
            });        
            var originalTitle = toCreate.title;    

            // Do create
            var created = await Video.create(toCreate);
            //console.log(created);

            // Confirm we have an object in the database
            
            //var found = await Video.findOne({_id: created._id});
            //var found = await Video.findById(created._id);
            //var found = await Video.find({title: created.title});
            //  Not sure why above don't find something  ??

            var search = {title: originalTitle};
            var found = await Video.findOne(search);
            assert.isNotNull(found);
            assert.equal(found.title, originalTitle);

            // Do the delete
            const response = await request(app).post('/videos/' + created._id + '/delete');
            //console.log(response.url);

            // Confirm object is deleted
            found = await Video.findOne({title: created.title});
            assert.isNull(found, "Video has not been deleted");
        });        
    });            


});