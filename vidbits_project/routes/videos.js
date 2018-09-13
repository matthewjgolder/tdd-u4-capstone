const Video = require("../models/video");
const router = require('express').Router();
var ObjectId = require('mongodb').ObjectID;

router.get('/', function(req, res, next) {
  res.redirect('/videos');
});

router.get('/videos', async function(req, res, next) {
  videos = await Video.find({}).exec();
  //console.log("videos", videos);
  res.render('videos', {videos:videos});
});


router.get('/videos/create', function(req, res, next) {
  res.render('videos/create');
});

router.post('/videos', async function(req, res, next) {
    //console.log("Post /videos called");
    var video = new Video(req.body)
    //console.log("video: ", video);
    
    video.validateSync();
    //console.log("validation: " , video);
    if(video.errors){
      res.status(400).render('videos/create', {video: video});
    } else {
      result = await Video.create(video);
      //console.log("result: " , result);
      await res.redirect('videos/' + result._id);  
    }
  });

router.get('/videos/:id', async function(req, res, next) {
  //console.log('/videos/:id params', req.params); 

  // Seem to be getting an extra _id:url value request. (only an issue in phantom js test)
  // make sure we have a valid id being passed.  
  if (req.params.id.length == 24) {
    var result = await Video.findOne({_id: req.params.id}); 
    //console.log('videos/show', req.params, result); 
    res.render('videos/show', {result:result});
  } else {
    res.status(400).send("");
  }
});

router.get('/videos/:id/edit', async function(req, res, next) {
  //console.log('/videos/:id/edit params', req.params); 

  if (req.params.id.length == 24) {
    var result = await Video.findOne({_id: req.params.id}); 
    //console.log('videos/show', result); 
    res.render('videos/edit', {video:result});
  } else {
    res.status(400).send("");
  }
});

router.post('/videos/:id/updates', async function(req, res, next) {
  //console.log("Post /videos/:id/updates called", req.body, 'params: ', req.params);
  var id = req.params.id;  

  // Warning this video caries a new _id don't use it direct for updates !!
  video = new Video(req.body)    
  
  video._id = id;
  
  video.validateSync();
  
  if(video.errors){
    //console.log("video.errors", video.errors);
    res.status(400).render('videos/edit', {video: video});
  } else {
    result = Video.findOneAndUpdate({_id: ObjectId(id)}, req.body,
      function(err, response){
        if (err) {
          console.log(err);
          res.send(err);
        }
      });    
    //console.log("result: ", result);
    await res.redirect('/videos/' + id);  
  }
});


router.post('/videos/:id/delete', async function(req, res, next) {  
  var id = req.params.id;  
  await Video.deleteOne({_id: ObjectId(id)});
  await res.redirect('/');  
});

module.exports = router;