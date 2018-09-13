const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../database-utilities');
const Video = require("../../models/video");

/**
 *
 * These functions came with this template it seems they should have been in database-utilities 
 * according instructions, but database-utilities to the which wasn't present as a file in the template
 * *  
 
async function connectDatabase() {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}
module.exports = {
  connectDatabase,
  disconnectDatabase,
}

*/

describe("Video model -", () => {
  it("has a title and a description", () => {
    const video = new Video({title: 1, description:2, url:3});
    //console.log(video);
    assert.strictEqual(video.title, "1");
    assert.strictEqual(video.description, "2");
    assert.strictEqual(video.url, "3");
  })
})
