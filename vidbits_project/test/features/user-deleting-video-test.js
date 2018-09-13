const {assert} = require('chai');

const {generateRandomUrl} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe("When a user deletes a video ", () =>{

    beforeEach(connectDatabase);
    
    afterEach(disconnectDatabase);
    
    it("it is removed and re-directs to landing page", () => {
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
        var videos = browser.getText("#videos-container");
        assert.include(videos, title);
        //assert.include(videos, description);  // not a requirement
        //console.log(browser.getHTML('body'));
        assert.include(browser.getHTML('iframe'), url);  

        // Use title to navigate to the single 
        browser.click('.video-title');

        // Delete
        browser.click('#delete-button');

        // "/" no longer contains the video.
        videos = browser.getText("#videos-container");
        assert.notInclude(videos, '.video-card');        
    });
});
