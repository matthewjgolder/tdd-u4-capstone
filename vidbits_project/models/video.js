const {mongoose} = require('../database')
//mongoose.set('debug', true);

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,  
      required:true  
    },
    description: {
      type: String,
      required:false        
    },
    url: {
      type: String,
      required:true        
    }
  })
);

module.exports = Video;
