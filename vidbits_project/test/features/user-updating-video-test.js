const {assert} = require('chai');
var chai = require('chai');
chai.use(require('chai-match'));

const {generateRandomUrl} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe("User updating an existing video", () =>{

    beforeEach(connectDatabase);
    
    afterEach(disconnectDatabase);

    it("changes the values, and displays new title on the landing page - not the old one", () => {

        browser.url('/');

        browser.click("#create-button");

        // Create a video
        var description = "my description";
        var title = "my title";
        var originalTitle = title;
        var url = generateRandomUrl('my-url');
        browser.setValue('#url-input', url);
        
        browser.setValue('#title-input', title);
        browser.setValue('#description-input', description);
        browser.setValue('#url-input', url);

        browser.click("#create-button"); // Navigates to single

        browser.click("#edit-button"); // Navigates to videos/{{id}}/edit
        
        var browserUrl = browser.getUrl();
        var id = browser.getAttribute('#_id-hidden', 'value')
        
        //chai.expect(browserUrl).to.match('.+videos/.+/edit'); //fails in libraries
        assert.include(browserUrl, 'videos/' + id + '/edit');

        // Update the values
        title = 'New Title';
        description += 'edited';
        url += '-edited';

        browser.setValue('#title-input', title);
        browser.setValue('#description-input', description);
        browser.setValue('#url-input', url);

        browser.click("#edit-button"); 

        // Should redirect back to show page which also shows title and description
        var browserUrl = browser.getUrl();
        assert.include(browserUrl, 'videos/'+id);
        
        assert.equal(browser.getText("#title"), title, 'Title update not applied correctly');
        assert.equal(browser.getText("#description"), description);
        assert.include(browser.getAttribute('iframe', 'src'), url); 

        // Check title is changed
        assert.include(browser.getHTML("Body"), title);
        assert.notInclude(browser.getHTML("Body"), originalTitle);
    })
})    