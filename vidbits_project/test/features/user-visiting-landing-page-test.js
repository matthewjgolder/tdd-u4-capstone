const {assert} = require('chai');

const {generateRandomUrl} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe("When a user visits landing page ", () =>{

    beforeEach(connectDatabase);
    
    afterEach(disconnectDatabase);

    describe("with no existing videos,", () => {
        it("the videos-container should be empty", () => {
            browser.url('/');
            assert.equal(browser.getText('#videos-container'), '');
        });
    });

    it("and navigates to the create page", () => {
        browser.url('/');

        assert.equal(browser.getText('#create-button'), 'Create a video');

        browser.click("#create-button");

        assert.include(browser.getText('body'), "Save a video");
    });

    describe("with existing videos,", () => {
        it("the videos-container should show the videos", () => {
            browser.url('/');

            browser.click("#create-button");
    
            // Create a video
            var description = "my description";
            var title = "my title";
            var url = generateRandomUrl('my-url');
            browser.setValue('#url-input', url);
            
    
            browser.setValue('#title-input', title);
            browser.setValue('#description-input', description);
            browser.setValue('#url-input', url);

            browser.click("#create-button"); // Navigates to single

            // Back to index page
            browser.url('/');

            // title and description show on the landing page
            const videos = browser.getText("#videos-container");
            assert.include(videos, title);
            //assert.include(videos, description);  // not a requirement
            //console.log(browser.getHTML('body'));
            assert.include(browser.getHTML('iframe'), url);  
        });

        it("clicking video title navigates to the video", () => {
            browser.url('/');

            browser.click("#create-button");
    
            // Create a video
            var description = "my description";
            var title = "my title";
            var url = generateRandomUrl('my-url');
    
            browser.setValue('#title-input', title);
            browser.setValue('#description-input', description);
            browser.setValue('#url-input', url);

            browser.click("#create-button"); // Navigates to single

            // Back to index page
            browser.url('/');

            // Navigate to title
            browser.click('.video-title');

            var browserUrl = browser.getUrl();
            assert.include(browserUrl, 'videos/');

            // Should redirect back to show page which also shows title and description
            assert.equal(browser.getText("#title"), title);
            assert.equal(browser.getText("#description"), description);
            assert.include(browser.getHTML('iframe'), url);  
        });
    });



});
