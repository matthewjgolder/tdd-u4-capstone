const {jsdom} = require('jsdom');

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
      return selectedElement.textContent;
    } else {
      throw new Error(`No element with selector ${selector} found in HTML string`);
    }
  };

  const parseTextAttributeFromHTML = (htmlAsString, selector, attribute) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);  
    //console.log(selectedElement);
    if (selectedElement !== null) {
      return selectedElement.getAttribute(attribute);
    } else {
      throw new Error(`No element with selector ${selector} found in HTML string`);
    }
  };

  const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`;
  };

module.exports = { parseTextFromHTML, parseTextAttributeFromHTML, generateRandomUrl};
  

