const {assert} = require('chai');

describe("When a user visits create page ", () =>{
    it("they should be able to submit title and description and return to show page", () => {

        browser.url('/videos/create');
        //browser.url('/');
        //browser.click("#create-button");

        var description = "my description";
        var title = "my title";
        var url = "my-url";

        browser.setValue('#title-input', title);
        browser.setValue('#description-input', description);
        browser.setValue('#url-input', url);

        //console.log(browser.getHTML('body'));
        assert.equal(browser.getText('#create-button'), 'Create');

        browser.click("#create-button");
        
        //console.log('URL:', browser.getUrl());
        //console.log(browser.getHTML('body'));

        // Should redirect back to show page which also shows title and description
        assert.equal(browser.getText("#title"), title);
        assert.equal(browser.getText("#description"), description);
        assert.include(browser.getAttribute('iframe', 'src'), url);
    });
});
